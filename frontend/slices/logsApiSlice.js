import { LOGS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const logsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLogs: builder.query({
      query: () => ({
        url: LOGS_URL,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Logs'],
    }),
    getLogDetails: builder.query({
      query: (_id) => ({
        url: `${LOGS_URL}/${_id}`,
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
  }),
});

export const { useGetLogsQuery, useGetLogDetailsQuery, useCreateLogMutation } =
  logsApiSlice;
