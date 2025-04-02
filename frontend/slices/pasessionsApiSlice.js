import { LOGS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const pasessionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPasession: builder.mutation({
      query: (data) => ({
        url: `${LOGS_URL}/${data.slugLog}/exercises/${data.slugExercise}/pasessions`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Exercises', 'Pasessions'],
    }),
    getPasessionSlug: builder.query({
      query: ({ slugLog, slugExercise, slugSession }) => ({
        url: `${LOGS_URL}/${slugLog}/exercises/${slugExercise}/pasessions/${slugSession}`,
      }),
      providesTags: [`Pasessions`],
      keepUnusedDataFor: 5,
    }),
    getPasessionById: builder.query({
      query: ({ slugLog, slugExercise, pasessionId }) => ({
        url: `${LOGS_URL}/${slugLog}/exercises/${slugExercise}/pasessions/edit/${pasessionId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updatePasessionId: builder.mutation({
      query: ({ slugLog, slugExercise, data }) => ({
        url: `${LOGS_URL}/${slugLog}/exercises/${slugExercise}/pasessions/edit/${data._id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Exercises', 'Pasessions'],
    }),
    deletePasession: builder.mutation({
      query: ({ slugLog, slugExercise, slugSession }) => ({
        url: `${LOGS_URL}/${slugLog}/exercises/${slugExercise}/pasessions/${slugSession}`,
        method: 'delete',
      }),
      invalidatesTags: ['Exercises', 'Pasessions'],
    }),
  }),
});

export const {
  useCreatePasessionMutation,
  useGetPasessionSlugQuery,
  useGetPasessionByIdQuery,
  useUpdatePasessionIdMutation,
  useDeletePasessionMutation,
} = pasessionsApiSlice;
