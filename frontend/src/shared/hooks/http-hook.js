import { useState, useCallback, useRef, useEffect } from 'react';
import {useHistory} from 'react-router-dom'

export const useHttpClient = () => {
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  //storing data across re render cycles
  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortController = new AbortController();
      //adding any aborted requests to a domain ref. Storing in front end but not in state so doesnt
      //depend on re renders
      activeHttpRequests.current.push(httpAbortController);
      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortController.signal,
        });
        const responseData = await response.json();
        //we want to clear the abort controllers not equal to the current abort controller
        activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortController)
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setIsLoading(false)
        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
    //see if this causes a problem but for now seems to work to redirect home if there's an error
    history.push('/')
  };

  useEffect(() => {
    //use effect cleanup/unmount function. Runs before next use of use effect. Basically means abort any
    //requests that might be stuck due to navigating away during the request etc
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);
  return { isLoading, error, sendRequest, clearError };
};
