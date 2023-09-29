// TODO: session storage is not secure due to XSS attacks
// possible fix: use httpOnly cookies instead

export function updateSessionStorage(token: string, secret: string) {
  if ((import.meta.env.VITE_REMEMBER_SESSION as boolean | undefined) || false) {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("secret", secret);
    localStorage.setItem("rememberSession", "true");
  } else {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("secret");
    localStorage.removeItem("rememberSession");
  }
}

export function getCredentials() {
  const savedToken = sessionStorage.getItem("token") || "";
  const savedSecret = sessionStorage.getItem("secret") || "";
  return { savedToken, savedSecret };
}
