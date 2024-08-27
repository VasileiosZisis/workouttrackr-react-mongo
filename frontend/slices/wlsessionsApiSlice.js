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
  }),
});

export const { useCreateWlsessionMutation } = wlsessionsApiSlice;
