import React from 'react'
import { useGrantContext } from '../../../hooks/ContextHooks'
import AlertBox from '../../AlertBox'
import Spinner from '../../Spinner'

const Dashboard = () => {
  const { loading, error, grant } = useGrantContext()
  return (
    <>
      <Spinner hidden={!loading} />
      <AlertBox my={2} hidden={!error}>
        {error}
      </AlertBox>
      {grant && (
        <>
          <p>Grant type: {grant.type}</p>
          <p>Grant startDate: {grant.startDate.toString()}</p>
        </>
      )}
    </>
  )
}

export default Dashboard
