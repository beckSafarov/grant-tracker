import React, { createContext, useReducer } from 'react'
import { getDataById, handleCoResearcherEmails } from '../firebase/controllers'
import {
  setGrantData,
  addGrantToUser,
  addMilestone as controlAddMilestone,
  setMilestone as controlSetMilestone,
  getAllGrants as getAllGrantsFromDB,
} from '../firebase/grantControllers'
import {
  addPublication,
  getPubsById,
  incrementPublications,
} from '../firebase/publicationsControllers'
import produce from 'immer'

const initialState = {
  loading: false,
  error: null,
  grant: null,
  allGrants: null,
}
export const GrantContext = createContext(initialState)

const GrantReducer = produce((draft, action) => {
  // draft.loading = action.type === 'loading'
  switch (action.type) {
    case 'loading':
      return { ...draft, loading: true }
    case 'success':
      return { ...draft, loading: false, success: true, grant: action.data }
    case 'error':
      return { ...draft, success: false, loading: false, error: action.error }
    case 'setAllGrants':
      return { ...draft, loading: false, success: true, allGrants: action.data }
    case 'resetSuccess':
      return { ...draft, success: false }
    case 'addPub':
      const prevPubs = draft.grant.publications || []
      draft.grant.publications = [...prevPubs, action.data]
      draft.loading = false
      draft.success = true
      break
    case 'setPublications':
      draft.loading = false
      draft.grant.publications = action.data
      break
    case 'addMilestone':
      const prevMiles = draft.grant.milestones || []
      draft.grant.milestones = [...prevMiles, action.data]
      draft.loading = false
      draft.success = true
      break
    case 'addActivity':
      const activities =
        draft?.grant?.milestones?.[action.msIndex]?.activities || []
      activities.push(action.data)
      draft.grant.milestones[action.msIndex].activites = activities
      break
    case 'backUpAddActivitySuccess':
      return { ...draft, success: true, loading: false }
    case 'setMilestone':
      const newData = action.data
      draft.grant.milestones = draft.grant.milestones.map((ms) =>
        ms.id === action.id ? { ...ms, ...newData } : ms
      )
      draft.loading = false
      draft.success = true
      break
    case 'resetState':
      draft[action.state] = false
      break
    default:
      return draft
  }
})

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
        type: grantData.type,
        researcherStatus: 'pi',
        startDate: grantData.startDate,
        endDate: grantData.endDate,
      }
      await addGrantToUser(mainGrantData)
      await handleCoResearcherEmails(
        { ...mainGrantData, info: grantData.info },
        { name: grantData.user.name }
      )
      dispatch({
        type: 'success',
        data: mainGrantData,
      })
    } catch (error) {
      dispatch({ type: 'error', error })
    }
  }

  const getGrantById = async (id) => {
    setLoading()
    const data = await getDataById('Grants', id)
    const error = 'No grant found with the id of ' + id
    data
      ? dispatch({ type: 'success', data })
      : dispatch({ type: 'error', error })
  }

  const getAllGrants = async () => {
    setLoading()
    try {
      const data = await getAllGrantsFromDB()
      dispatch({ type: 'setAllGrants', data })
    } catch (error) {
      dispatch({ type: 'error', error })
    }
  }

  const addPub = async (data, pubNumbers) => {
    setLoading()
    try {
      const { id } = await addPublication(data)
      await incrementPublications(data, pubNumbers)
      dispatch({ type: 'addPub', data: { ...data, id } })
    } catch (error) {
      dispatch({ type: 'error', error })
    }
  }

  const getPubs = async (id) => {
    setLoading()
    try {
      const data = await getPubsById('grantId', id)
      dispatch({ type: 'setPublications', data })
    } catch (error) {
      dispatch({ type: 'error', error })
    }
  }

  const addMilestone = async (data, grantId) => {
    setLoading()
    try {
      const { id } = await controlAddMilestone(data, grantId)
      dispatch({ type: 'addMilestone', data: { ...data, id } })
    } catch (error) {
      dispatch({ type: 'error', error })
    }
  }

  const setMilestone = async (updates, msId, grantId) => {
    setLoading()
    try {
      await controlSetMilestone({ ...updates, id: msId }, grantId)
      dispatch({ type: 'setMilestone', data: updates, id: msId })
    } catch (error) {
      dispatch({ type: 'error', error })
    }
  }

  const addMilestoneActivity = (data, msIndex) => {
    dispatch({ type: 'addActivity', data, msIndex })
  }

  const backUpSetMilestone = async (newActivity, msIndex, grantId) => {
    // setLoading()
    // const milestone = { ...state.grant.milestones[msIndex] }
    // milestone.activities = milestone.activities || []
    // milestone.activities.push(newActivity)
    // try {
    //   const res = await controlSetMilestone(updatedMilestone, grantId)
    //   dispatch({ type: 'addbackUpAddActivitySuccess' })
    //   console.log(res)
    // } catch (error) {
    //   dispatch({ type: 'error', error })
    // }
  }

  const resetState = (stateToReset) =>
    dispatch({ type: 'resetState', state: stateToReset })

  const resetSuccess = () => resetState('success')

  return (
    <GrantContext.Provider
      value={{
        ...state,
        allGrants: state.allGrants,
        setNewGrant,
        getGrantById,
        getAllGrants,
        resetState,
        resetSuccess,
        addPub,
        getPubs,
        addMilestone,
        setMilestone,
        addMilestoneActivity,
        backUpSetMilestone,
      }}
    >
      {children}
    </GrantContext.Provider>
  )
}
