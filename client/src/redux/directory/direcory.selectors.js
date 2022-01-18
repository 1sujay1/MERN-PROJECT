import { createSelector } from "reselect";

const selectDirectory = (state) => state.directory;

export const selectSelections = createSelector(
    [selectDirectory],
    directory => directory.sections
)