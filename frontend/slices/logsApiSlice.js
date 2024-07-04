import { LOGS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const logsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLogs: builder.query({
      query: () => ({
        url: LOGS_URL,
      }),
      providesTags: ['Logs'],
      keepUnusedDataFor: 5,
    }),
    getLogDetails: builder.query({
      query: (slugLog) => ({
        url: `${LOGS_URL}/${slugLog}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createLog: builder.mutation({
      query: (data) => ({
        url: LOGS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Logs'],
    }),
    updateLog: builder.mutation({
      query: (data) => ({
        url: `${LOGS_URL}/${data.slugLog}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Logs'],
    }),
  }),
});

export const {
  useGetLogsQuery,
  useGetLogDetailsQuery,
  useCreateLogMutation,
  useUpdateLogMutation,
} = logsApiSlice;
