import { LOGS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const wlsessionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createWlsession: builder.mutation({
      query: (data) => ({
        url: `${LOGS_URL}/${data.slugLog}/exercises/${data.slugExercise}/wlsessions`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Wlsessions'],
    }),
    getWlsessionSlug: builder.query({
      query: ({ slugLog, slugExercise, slugSession }) => ({
        url: `${LOGS_URL}/${slugLog}/exercises/${slugExercise}/wlsessions/${slugSession}`,
      }),
      providesTags: [`Wlsessions`],
      keepUnusedDataFor: 5,
    }),
    getWlsessionById: builder.query({
      query: ({ slugLog, slugExercise, wlsessionId }) => ({
        url: `${LOGS_URL}/${slugLog}/exercises/${slugExercise}/wlsessions/edit/${wlsessionId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateWlsessionId: builder.mutation({
      query: ({ slugLog, slugExercise, data }) => ({
        url: `${LOGS_URL}/${slugLog}/exercises/${slugExercise}/wlsessions/edit/${data._id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Wlsessions'],
    }),
  }),
});

export const {
  useCreateWlsessionMutation,
  useGetWlsessionSlugQuery,
  useGetWlsessionByIdQuery,
  useUpdateWlsessionIdMutation,
} = wlsessionsApiSlice;
