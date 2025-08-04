let input = document.getElementById('inputBox');
let buttons = document.querySelectorAll('button');

let string = "";

let arr = Array.from(buttons);
// Function to fetch and display history
function updateHistory() {
    fetch('http://localhost:3001/api/history')
        .then(res => res.json())
        .then(data => {
            const historyList = document.getElementById('historyList');
            if (!historyList) return;
            historyList.innerHTML = '';
            data.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.expression} = ${item.result}`;
                historyList.appendChild(li);
            });
        })
        .catch(err => console.error('Error fetching history:', err));
}

arr.forEach(button => {
    button.addEventListener('click', (e) => {
        let value = e.target.innerHTML;

        if (value == '=') {
            if (string.trim() === "") {
                input.value = "Enter a value";
            } else {
                try {
                    let expression = string;
                    let result = eval(string);
                    string = result;
                    input.value = string;
                    // Send history to backend
                    fetch('http://localhost:3001/api/history', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ expression, result })
                    })
                    .catch(err => console.error('Error saving history:', err));
                    // Update history after saving
                    setTimeout(updateHistory, 300);
                } catch (error) {
                    input.value = "Invalid expression";
                }
            }
        }

        else if (value == 'AC') {
            string = "";
            input.value = string;
        }

        else if (value == 'DEL') {
            string = string.substring(0, string.length - 1);
            input.value = string;
        }

        else {
            if (string.length >= 10) {
                input.value = "Max digit limit reached";
                setTimeout(() => {
                    input.value = string;
                }, 1500); // 1.5 seconds me original value wapas
            } else {
                string += value;
                input.value = string;
            }
        }
    });
});

// Initial load of history
updateHistory();
