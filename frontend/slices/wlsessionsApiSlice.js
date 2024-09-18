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
  }),
});

export const { useCreateWlsessionMutation, useGetWlsessionSlugQuery } =
  wlsessionsApiSlice;
