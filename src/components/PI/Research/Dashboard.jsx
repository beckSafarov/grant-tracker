import React from 'react'
import { stringifyDates } from '../../../helpers/dateHelpers'
import { useGrantContext } from '../../../hooks/ContextHooks'
import AlertBox from '../../AlertBox'
import Spinner from '../../Spinner'

const Dashboard = () => {
  const { loading, error, grant } = useGrantContext()
  // const { startDate, endDate } = stringifyDates(grant)
  return (
    <>
      <Spinner hidden={!loading} />
      <AlertBox my={2} hidden={!error}>
        {error?.toString() || ''}
      </AlertBox>

      {grant && (
        <>
          <p>Grant type: {grant.type}</p>
          <p>Grant startDate: {stringifyDates(grant).startDate}</p>
        </>
      )}
    </>
  )
}

export default Dashboard
