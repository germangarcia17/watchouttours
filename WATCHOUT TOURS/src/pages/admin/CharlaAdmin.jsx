import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { SESIONES } from '../../config/charla'

/* Inscripciones a la charla online (tabla charla_inscripciones). Solo
   lectura: las inscripciones las escribe la Netlify Function
   charla-inscripcion. Permite descargar un CSV por sesión, por ejemplo para
   enviar un email a mano. */

const fechaHora = iso => iso
  ? new Date(iso).toLocaleString('es-ES', { timeZone: 'Europe/Madrid', dateStyle: 'short', timeStyle: 'short' })
  : '—'

function csv(filas) {
  const cols = ['created_at', 'nombre', 'email', 'sesion', 'idioma', 'acepta_noticias', 'pregunta', 'confirmacion_enviada_at', 'recordatorio_24h_at', 'recordatorio_1h_at', 'seguimiento_at']
  const celda = v => `"${String(v ?? '').replace(/"/g, '""')}"`
  return [cols.join(','), ...filas.map(f => cols.map(c => celda(f[c])).join(','))].join('\r\n')
}

function descargar(nombre, contenido) {
  const url = URL.createObjectURL(new Blob(['﻿' + contenido], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = nombre
  a.click()
  URL.revokeObjectURL(url)
}

export default function CharlaAdmin() {
  const [filas, setFilas] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    document.title = 'Charla | Watchout Tours Admin'
    supabase
      .from('charla_inscripciones')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data, error: err }) => {
        if (err) setError(err.message)
        else setFilas(data ?? [])
      })
  }, [])

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Inscripciones a la charla</h1>
      </div>

      {error && <p role="alert" className="form-error">No se pudieron cargar las inscripciones: {error}</p>}
      {!filas && !error && <p role="status">Cargando…</p>}

      {filas && SESIONES.map(s => {
        const deSesion = filas.filter(f => f.sesion === s.id)
        const sinConfirmar = deSesion.filter(f => !f.confirmacion_enviada_at).length
        return (
          <section key={s.id} aria-labelledby={`sesion-${s.id}`} style={{ marginBottom: '2.5rem' }}>
            <h2 id={`sesion-${s.id}`}>{s.fecha.es}, {s.horas.es} (España peninsular)</h2>
            <p>
              {deSesion.length} inscripciones
              {sinConfirmar > 0 && ` · ${sinConfirmar} sin email de confirmación (no recibirán recordatorios)`}
              {' · '}{deSesion.filter(f => f.acepta_noticias).length} quieren noticias
            </p>
            {deSesion.length > 0 && (
              <>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => descargar(`inscripciones-charla-${s.id}.csv`, csv(deSesion))}>
                  Descargar CSV de esta sesión
                </button>
                <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                  <table className="admin-table">
                    <caption className="sr-only">Inscripciones de la sesión del {s.fecha.es}</caption>
                    <thead>
                      <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Email</th>
                        <th scope="col">Inscripción</th>
                        <th scope="col">Pregunta</th>
                        <th scope="col">Noticias</th>
                        <th scope="col">Emails enviados</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deSesion.map(f => (
                        <tr key={f.id}>
                          <th scope="row">{f.nombre}</th>
                          <td>{f.email}</td>
                          <td>{fechaHora(f.created_at)}{f.idioma === 'en' ? ' (web en inglés)' : ''}</td>
                          <td>{f.pregunta || '—'}</td>
                          <td>{f.acepta_noticias ? 'Sí' : 'No'}</td>
                          <td>
                            {[
                              f.confirmacion_enviada_at ? 'confirmación' : 'confirmación: NO',
                              f.recordatorio_24h_at && '24 h',
                              f.recordatorio_1h_at && '1 h',
                              f.seguimiento_at && 'seguimiento',
                            ].filter(Boolean).join(', ')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>
        )
      })}
    </div>
  )
}
