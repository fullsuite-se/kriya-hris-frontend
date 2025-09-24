// import { create } from "zustand";


// export const useAllEmployeesStore = create((set) => ({
//   counts: null,
//   lastFetchedCounts: 0,
//   setCounts: (counts) => set({ counts, lastFetchedCounts: Date.now() }),
//   clearCounts: () => set({ counts: null, lastFetchedCounts: 0 }),

//   // 👇 new slice for all employees
//   employees: [],
//   total: 0,
//   totalPages: 1,
//   page: 1,
//   pageSize: 10,
//   filters: {},
//   lastFetchedEmployees: 0,

//   setEmployees: (data) =>
//     set({
//       employees: data.users,
//       total: data.total,
//       page: data.page,
//       totalPages: data.totalPages,
//       lastFetchedEmployees: Date.now(),
//     }),

//   clearEmployees: () =>
//     set({
//       employees: [],
//       total: 0,
//       totalPages: 1,
//       page: 1,
//       filters: {},
//       lastFetchedEmployees: 0,
//     }),
// }));
