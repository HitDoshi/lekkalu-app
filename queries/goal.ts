import { useMutation, useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useToast } from 'native-base'

import { GOAL_QUERY_KEYS } from '@/utils/query-keys/goal'
import { apiClient, apiv2Client } from '@/utils/client'

interface AddGoalPayloadType {
  name: string
  target_value: number
  target_contribution_source: number
  track_kpi: string
  goal_proportionality: string
  target_date: string
}

const getGoalKpiData = () => {
  return apiv2Client.get('/kpis_type')
}

const useGetGoalKpiData = () => {
  return useQuery({
    queryKey: [GOAL_QUERY_KEYS.GOAL_KPI],
    queryFn: getGoalKpiData,
  })
}

const getGoalProportionalityData = () => {
  return apiv2Client.get('/goal_proportionality_type')
}

const useGetProportionality = () => {
  return useQuery({
    queryKey: [GOAL_QUERY_KEYS.GOAL_PROPORTIONALITY],
    queryFn: getGoalProportionalityData,
  })
}

const addGoalMutationFn = async (data: AddGoalPayloadType) => {
  return apiv2Client.post('/financial_goal/', data)
}

const useAddGoalMutation = () => {
  const toast = useToast()
  return useMutation({
    mutationFn: addGoalMutationFn,
    onSuccess: () => {
      router.push('/(authenticated)/goals')
    },
    onError: () => {
      toast.show({ title: 'Failed to create Goal! Please try again' })
    },
  })
}

const getGoalSources = () => {
  return apiClient.get('/income_expense/')
}

const useGetGoalSources = () => {
  return useQuery({
    queryKey: [GOAL_QUERY_KEYS.GOAL_SOURCE],
    queryFn: getGoalSources,
  })
}

const getGoals = () => {
  return apiv2Client.get('/financial_goal/')
}

const useGetGoals = () => {
  return useQuery({
    queryKey: [GOAL_QUERY_KEYS.GOALS],
    queryFn: getGoals,
  })
}

const getGoalProgress = (id: number) => {
  return apiv2Client.get(`/financial_goal/progress/${id}`)
}

const useGetGoalProgress = (id: number) => {
  return useQuery({
    queryKey: [GOAL_QUERY_KEYS.GOALS_PROGRESS, id],
    queryFn: () => getGoalProgress(id),
  })
}

const getGoalDetails = (id: number) => {
  return apiv2Client.get(`/financial_goal/${id}`)
}

const useGetGoalDetails = (id: number) => {
  return useQuery({
    queryKey: [GOAL_QUERY_KEYS.GOAL_DETAILS, id],
    queryFn: () => getGoalDetails(id),
  })
}

const getGoalTimeline = (id: number) => {
  return apiv2Client.get(`/financial_goal/timeline/${id}/`)
}

const useGetGoalTimeline = (id: number) => {
  return useQuery({
    queryKey: [GOAL_QUERY_KEYS.GOAL_TIMELINE, id],
    queryFn: () => getGoalTimeline(id),
  })
}

export {
  useGetGoalKpiData,
  useGetProportionality,
  useAddGoalMutation,
  AddGoalPayloadType,
  useGetGoalSources,
  useGetGoals,
  useGetGoalProgress,
  useGetGoalDetails,
  useGetGoalTimeline,
}