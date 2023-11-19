import { atom } from "nanostores";

const initialValue = "";

const queryStore = atom(initialValue);

function setQuery(value) {
  queryStore.set(value);
}

export { queryStore, setQuery };
