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
      invalidatesTags: ['Exercises', 'Logs'],
    }),
    getExerciseSlug: builder.query({
      // query: ({ slugLog, slugExercise, limit, page }) => ({
      //   url: `${LOGS_URL}/${slugLog}/exercises/${slugExercise}?limit=${limit}&page=${page}`,
      // }),
      query: ({ slugLog, slugExercise, limit, page }) => {
        const queryParams = new URLSearchParams();
        if (limit) queryParams.append('limit', limit);
        if (page) queryParams.append('page', page);

        return {
          url: `${LOGS_URL}/${slugLog}/exercises/${slugExercise}${
            queryParams.toString() ? `?${queryParams.toString()}` : ''
          }`,
        };
      },
      providesTags: ['Exercises'],
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
      invalidatesTags: ['Exercises', 'Logs'],
    }),
    deleteExercise: builder.mutation({
      query: ({ slugLog, slugExercise }) => ({
        url: `${LOGS_URL}/${slugLog}/exercises/${slugExercise}`,
        method: 'delete',
      }),
      invalidatesTags: ['Exercises', 'Logs'],
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
