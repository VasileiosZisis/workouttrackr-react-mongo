import { LOGS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const logsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createLog: builder.mutation({
      query: (data) => ({
        url: LOGS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Logs'],
    }),
    getLogs: builder.query({
      query: () => ({
        url: LOGS_URL,
      }),
      providesTags: ['Logs'],
      keepUnusedDataFor: 5,
    }),
    getLogSlug: builder.query({
      query: (slugLog) => ({
        url: `${LOGS_URL}/${slugLog}`,
      }),
      providesTags: ['Logs'],
      keepUnusedDataFor: 5,
    }),
    getLogId: builder.query({
      query: (_id) => ({
        url: `${LOGS_URL}/edit/${_id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateLogId: builder.mutation({
      query: (data) => ({
        url: `${LOGS_URL}/edit/${data._id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Logs'],
    }),
    deleteLog: builder.mutation({
      query: (slugLog) => ({
        url: `${LOGS_URL}/${slugLog}`,
        method: 'delete',
      }),
      invalidatesTags: ['Logs'],
    }),
  }),
});

export const {
  useGetLogsQuery,
  useGetLogSlugQuery,
  useGetLogIdQuery,
  useCreateLogMutation,
  useUpdateLogIdMutation,
  useDeleteLogMutation,
} = logsApiSlice;
