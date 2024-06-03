document.addEventListener('DOMContentLoaded', async function() {
    // Your existing code...
  
    // Assuming your data is stored in a variable called 'dataToSend'
    const dataToSend = await (await fetch('exempleData.json')).json();

    console.log(dataToSend);
  
    // Send data to the server
    await sendDataToServer(dataToSend);
  });
  
  async function sendDataToServer(data) {
    try {
        const response = await fetch('http://127.0.0.1:8080/receiveData', {
            method: 'POST',
            mode: 'no-cors', 
            headers: {
              'Content-Type': 'application/json',
            },
            body: data,
          });
        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.message;
          throw errorMessage;
        }
        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
      console.error('Error sending data to the server:', error);
    }
  }
  