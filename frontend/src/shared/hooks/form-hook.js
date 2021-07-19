import { useCallback, useReducer } from 'react';

const formReducer = (state, action) => {
  //quite complex but basically
  // first check if the input ID is equal to the action type (let's say you're editing title)
  //form is valid(initially true) will be true unless it fails the action is valid test (like failing min length or require tests)
  //else (if the input id is not currently being changed but has been in the past( filled out a field but currently user is on another field))
  //form is still valid unless the stored state of this input fails a validity test
  //if any of these tests fail, you'll have a false value somewhere which will cause the overall form to not be valid
  switch (action.type) {
    case 'INPUT_CHANGE':
      let formIsValid = true;
      for (const inputId in state.inputs) {
        //in here because we sometimes have a dynamic form where fields are added or dropped depending on what the user is doing
        //(for example first name when creating a new user, but no  firstname when just logging in (use email instead for instance))
        if(!state.inputs[inputId]){
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }

      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    case 'SET_DATA':
      return {
        inputs: action.inputs,
        isValid: action.formIsValid
      }
    default:
      return state;
  }
};

export const useForm = (initialInputs, initialFormValidity) => {
  const [formState, dispatch]= useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity,
  });

  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: 'INPUT_CHANGE',
      value: value,
      isValid: isValid,
      inputId: id,
    });
  }, []);

  const setFormData = useCallback((inputData, formValidity)=> {
    dispatch({
      type: 'SET_DATA',
      inputs: inputData,
      formIsValid: formValidity
    })
  },[])

  return [formState, inputHandler,setFormData ]
}