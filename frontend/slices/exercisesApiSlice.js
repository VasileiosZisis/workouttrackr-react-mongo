import { LOGS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const exercisesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createExercise: builder.mutation({
      query: (data) => ({
        url: `${LOGS_URL}/${data.slugLog}/exercises`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Exercises'],
    }),
  }),
});

export const { useCreateExerciseMutation } = exercisesApiSlice;
