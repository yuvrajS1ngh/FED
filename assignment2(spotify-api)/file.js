async function fetchData() {
    // JavaScript Example: Fetch All Data
    // This function demonstrates how to fetch all data using the Fetch API.

    const url = "https://freetestapi.com/api/v1/posts";

    try {
      const response = await fetch(url);
      const result = await response.text();
      console.log(result);
    } catch (error) {
      throw new Error("Error fetching data:" + error);
    }
  }

  fetchData();