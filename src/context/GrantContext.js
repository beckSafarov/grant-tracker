import React, { createContext, useReducer } from 'react'
import { getDataById } from '../firebase/helperControllers'
import { handleCoResearcherEmails } from '../firebase/userControllers'
import {
  addExpense as addExpInDB,
  updateExpense as updateExpInDB,
} from '../firebase/expenseControllers'
import {
  setGrantData,
  addGrantToUser,
  addMilestone as controlAddMilestone,
  updateMilestone as updateMsInDB,
  addActivity as addActInDB,
  updateActivity as updateActInDB,
  deleteActivity as deleteActFromDB,
  getCoResearchers as getCorchers,
  getGrantsBySchool,
  extendGrantDeadline as extendDeadline,
  updateGrant as updateGrantInDB,
} from '../firebase/grantControllers'
import {
  addPublication,
  getPubsById,
  incrementPublications,
} from '../firebase/pubControllers'
import { datesToTimeStamp } from '../helpers/msHelpers'
import { GrantReducer } from './reducers/GrantReducer'

const initialState = {
  loading: false,
  error: null,
  grant: null,
  allGrants: null,
}
export const GrantContext = createContext(initialState)

export const GrantProvider = ({ children }) => {
  const [state, dispatch] = useReducer(GrantReducer, initialState)

  const setLoading = () => dispatch({ type: 'loading' })

  /**
   * @grantData Obj:{type, vots, info, uid }
   */
  const setNewGrant = async (grantData) => {
    setLoading()
    try {
      const res = await setGrantData(grantData)
      const mainGrantData = {
        id: res.grantId,
        title: grantData.title,
        type: grantData.type,
        researcherStatus: 'pi',
        startDate: grantData.startDate,
        endDate: grantData.endDate,
      }
      const moreGrantData = { ...mainGrantData, info: grantData.info }
      await addGrantToUser(mainGrantData)
      await handleCoResearcherEmails(mainGrantData, {
        name: grantData.user.name,
      })
      dispatch({ type: 'setGrantSuccess', data: moreGrantData })
    } catch (error) {
      dispatch({ type: 'error', error })
    }
  }

  const getGrantById = async (id) => {
    setLoading()
    const data = await getDataById('Grants', id)
    const error = 'No grant found with the id of ' + id
    data
      ? dispatch({ type: 'setGrantSuccess', data })
      : dispatch({ type: 'error', error })
  }

  const getAllGrants = async (school) => {
    setLoading()
    try {
      const { data } = await getGrantsBySchool(school)
      dispatch({ type: 'setAllGrants', data })
    } catch (error) {
      dispatch({ type: 'error', error })
    }
  }

  const addPub = async (data, pubNumbers) => {
    setLoading()
    const buildToDate = (type) => ({ toDate: () => new Date(data[type]) })
    const dataForContext = {
      ...data,
      startDate: buildToDate('startDate'),
      endDate: buildToDate('endDate'),
    }
    try {
      const { id } = await addPublication(data)
      await incrementPublications(data, pubNumbers)
      dispatch({ type: 'addPub', data: { ...dataForContext, id } })
    } catch (error) {
      dispatch({ type: 'error', error })
    }
  }

  const getPubs = async (id) => {
    setLoading()
    try {
      const { data } = await getPubsById(id)
      dispatch({ type: 'setPublications', data })
    } catch (error) {
      dispatch({ type: 'error', error })
    }
  }

  const addMilestone = async (data, grantId) => {
    setLoading()
    const buildToDate = (type) => ({ toDate: () => new Date(data[type]) })
    const dataForContext = {
      ...data,
      startDate: buildToDate('startDate'),
      endDate: buildToDate('endDate'),
    }
    try {
      const { id } = await controlAddMilestone(data, grantId)
      dispatch({ type: 'addMilestone', data: { ...dataForContext, id } })
    } catch (error) {
      dispatch({ type: 'error', error })
    }
  }

  const updateMilestone = async (data, id) => {
    const updated = datesToTimeStamp(data)
    dispatch({ type: 'updateMilestone', data: updated, id })
  }

  const addActivity = (data) => {
    dispatch({ type: 'addActivity', data })
  }

  const updateActivity = (updates, id) => {
    dispatch({ type: 'updateActivity', updates, id })
  }

  const deleteActivity = (id) => {
    dispatch({ type: 'deleteActivity', id })
  }

  const backup = async (type, data, ids = {}) => {
    dispatch({ type: 'backgroundLoading' })
    const handleRes = ({ error }) => {
      return error
        ? dispatch({ type: 'error', error })
        : dispatch({ type: 'backupSuccess' })
    }
    switch (type) {
      case 'updateMilestone':
        const msUpdateRes = await updateMsInDB(data, ids.grant, ids.ms)
        handleRes(msUpdateRes)
        break
      case 'addActivity':
        const addRes = await addActInDB(data, ids.grant)
        handleRes(addRes)
        break
      case 'updateActivity':
        const updateRes = await updateActInDB(ids.grant, ids.act, data)
        handleRes(updateRes)
        break
      case 'deleteActivity':
        const delRes = await deleteActFromDB(ids.grant, ids.act)
        handleRes(delRes)
        break
    }
  }

  const addExpense = async (expense, grantId) => {
    setLoading()
    try {
      await addExpInDB(expense, grantId)
      dispatch({ type: 'addExpense', data: expense })
    } catch (error) {
      dispatch({ type: 'error', error })
    }
  }
  const updateExpense = async (updates, grantId, expenseId) => {
    setLoading()
    try {
      await updateExpInDB(updates, grantId, expenseId)
      dispatch({ type: 'updateExpense', data: updates, id: expenseId })
    } catch (error) {
      dispatch({ type: 'error', error })
    }
  }

  const getCoResearchers = async (id) => {
    setLoading()
    try {
      const data = await getCorchers(id)
      console.log(data)
      dispatch({ type: 'coResearchersReceived', data })
    } catch (error) {
      dispatch({ type: 'error', error })
    }
  }

  const resetState = (stateToReset) =>
    dispatch({ type: 'resetState', state: stateToReset })

  const resetSuccess = () => resetState('success')

  const updateGrant = async (id, updates) => {
    setLoading()
    try {
      await updateGrantInDB(id, updates)
      dispatch({ type: 'updateGrant', data: updates })
    } catch (error) {
      dispatch({ type: 'error', error })
    }
  }

  return (
    <GrantContext.Provider
      value={{
        ...state,
        setNewGrant,
        getGrantById,
        getAllGrants,
        resetState,
        resetSuccess,
        addPub,
        getPubs,
        addMilestone,
        updateMilestone,
        addActivity,
        updateActivity,
        deleteActivity,
        addExpense,
        updateExpense,
        backup,
        getCoResearchers,
        updateGrant,
      }}
    >
      {children}
    </GrantContext.Provider>
  )
}
