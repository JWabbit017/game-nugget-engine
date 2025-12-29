"use strict";

/**
 * @param {string} endpoint API Endpoint to make the request to
 * @param {string} id Pokemon ID
 * @param {string} options Request path modifiers
 * @param {string} fetchMethod HTTPS request method to use. Defaults to GET
 * @returns {Promise<object>} Promise containing response data
 */
export default async function Request(
  endpoint,
  id,
  options = "",
  fetchMethod = "GET"
) {
  try {
    const address = `https://pokeapi.co/api/v2/${endpoint}/${id}/${options}`;
    const response = await fetch(address, { method: fetchMethod });
    const data = await response.json();
    if (data !== undefined) {
      return data;
    } else {
      throw new Error("Response is undefined");
    }
  } catch (err) {
    console.error(err);
  }
}
