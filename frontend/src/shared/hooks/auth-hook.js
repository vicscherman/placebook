import {useState, useCallback, useEffect} from 'react'

let logoutTimer;
export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [tokenExpirationTime, setTokenExpirationTime] = useState();
  const [userId, setUserId] = useState(null);
  // for setting the overall stored login state

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    //token expiration is one hour from creation time
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationTime(tokenExpirationDate);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);
  //for setting the stored logout state
  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationTime(null)
    setUserId(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if (token && tokenExpirationTime) {
      const remainingTime =
        tokenExpirationTime.getTime() - new Date().getTime();
    logoutTimer = setTimeout(logout, remainingTime);
    }else{
      clearTimeout(logoutTimer)
    }
  }, [token, logout, tokenExpirationTime]);

  //for checking if there's a token in localstorage
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    //  if the expiration date is greater than the new Date anonymous function which calls the current time,
    //the token isn't expired
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  return {token, userId, login, logout}
}