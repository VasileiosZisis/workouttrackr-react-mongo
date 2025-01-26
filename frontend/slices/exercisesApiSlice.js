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
    getExerciseSlug: builder.query({
      query: ({ slugLog, slugExercise, limit, page }) => ({
        url: `${LOGS_URL}/${slugLog}/exercises/${slugExercise}?limit=${limit}&page=${page}`,
      }),
      providesTags: ['Exercises'],
      keepUnusedDataFor: 5,
    }),
    getExerciseId: builder.query({
      query: ({ slugLog, exerciseId }) => ({
        url: `${LOGS_URL}/${slugLog}/exercises/edit/${exerciseId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateExerciseId: builder.mutation({
      query: ({ slugLog, data }) => ({
        url: `${LOGS_URL}/${slugLog}/exercises/edit/${data._id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Exercises'],
    }),
    deleteExercise: builder.mutation({
      query: ({ slugLog, slugExercise }) => ({
        url: `${LOGS_URL}/${slugLog}/exercises/${slugExercise}`,
        method: 'delete',
      }),
      invalidatesTags: ['Exercises'],
    }),
  }),
});

export const {
  useCreateExerciseMutation,
  useGetExerciseSlugQuery,
  useGetExerciseIdQuery,
  useUpdateExerciseIdMutation,
  useDeleteExerciseMutation,
} = exercisesApiSlice;
