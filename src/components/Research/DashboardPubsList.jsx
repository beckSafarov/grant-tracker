import { Button } from '@mui/material'
import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGrantContext } from '../../hooks/ContextHooks'
import ErrorAlert from '../ErrorAlert'
import LocalSpinner from '../LocalSpinner'

const DashboardPubsList = () => {
  const { grant, loading, error, getPubs } = useGrantContext()
  const pubs = grant.publications || null
  const navigate = useNavigate()
  const [isIntersecting, setIsIntersecting] = useState(false)

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        setIsIntersecting(entry.isIntersecting)
      })
    },
    { threshold: 0.5 }
  )

  useEffect(() => {
    if (!pubs && grant) getPubs(grant.id)
    setObserver()
  }, [grant, pubs, isIntersecting])

  const setObserver = () => {
    const elem = document.querySelector('#pubsOverview')
    if (elem) {
      console.log(elem)
      observer.observe(elem)
    }
  }

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
    </div>
  )
}

export default DashboardPubsList
