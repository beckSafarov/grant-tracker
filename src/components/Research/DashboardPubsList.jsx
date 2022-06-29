import { Button } from '@mui/material'
import React, { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { isNone } from '../../helpers'
import { useGrantContext } from '../../hooks/ContextHooks'
import ErrorAlert from '../ErrorAlert'
import LocalSpinner from '../LocalSpinner'

const DashboardPubsList = () => {
  const { grant, loading, error, getPubs } = useGrantContext()
  const pubs = grant.publications || null
  const navigate = useNavigate()

  useEffect(() => {
    if (!pubs && grant) getPubs(grant.id)
  }, [grant, pubs])

  const getPubData = useCallback(() => {
    if (!pubs) return []
    return pubs.map((pub) => {
      return `${pub.title} (${pub.year}). ${pub.jonference + '.' || ''} DOI: ${
        pub.doi
      }`
    })
  }, [pubs])

  return (
    <div id='#pubsOverview' style={{ position: 'relative', height: '100%' }}>
      <LocalSpinner hidden={!loading} />
      <ErrorAlert error={error} />
      {!isNone(pubs) ? (
        <>
          <ol>
            {getPubData()
              .slice(0, 3)
              .map((pub, i) => (
                <li key={i}>{pub}</li>
              ))}
          </ol>
          <Button
            onClick={() => navigate(`/research/${grant.id}/publications`)}
            type='button'
            variant='text'
            sx={{ width: '100%' }}
          >
            More
          </Button>
        </>
      ) : (
        <div
          style={{
            textAlign: 'center',
            color: '#ccc',
          }}
        >
          No Publications
        </div>
      )}
    </div>
  )
}

export default DashboardPubsList
