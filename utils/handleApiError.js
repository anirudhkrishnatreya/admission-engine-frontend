export const handleApiError = (error) => {
  if (error.response?.data?.errors) {
    return error.response.data.errors;
  }

  if (error.response?.data?.message) {
    return [error.response.data.message];
  }

  return ["Something went wrong."];
};