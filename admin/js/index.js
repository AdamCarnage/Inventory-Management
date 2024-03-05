fetch('/sales_data')
    .then(response => response.json())
    .then(data => {
        const labels = data.map(entry => entry.month_year);
        const salesData = data.map(entry => entry.total_sales);

        // Create the bar chart
        const ctx = document.getElementById('myBarChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Sales',
                    backgroundColor: 'rgba(172, 207, 254, 0.7)',
                    data: salesData,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error fetching data:', error));


/*------------------add delete btn in all table rows------------------------*/
document.querySelectorAll('.btn-danger').forEach(button => {
    button.addEventListener('click', function () {
        const row = this.closest('tr');
        const rowIndex = row.rowIndex;
        // console.log(`Button in row ${rowIndex} was clicked`);
    });
});


/*------------------delete produts using id------------------------*/
document.addEventListener('DOMContentLoaded', () => {
    const deleteIcons = document.querySelectorAll('.delete-icon');

    deleteIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const itemId = icon.dataset.id;

            const confirmation = confirm('Are you sure you want to delete this item?');

            if (confirmation) {
                fetch(`/delete/${itemId}`, {
                    method: 'DELETE'
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log(data.message);
                        location.reload();
                    })
                    .catch(error => console.error('Error:', error));
            }
        });
    });
});




/*------------------Edit produts details using id------------------------*/
document.addEventListener('DOMContentLoaded', () => {
    const editButtons = document.querySelectorAll('.btn.btn-primary');

    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemId = button.dataset.id;
            window.location.href = `/edit/${itemId}`;
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Get the select-all checkbox in the thead
    const selectAllCheckbox = document.getElementById("select-all");

    // Get all the checkboxes in the tbody
    const checkboxes = document.querySelectorAll("tbody input[type='checkbox']");

    // Add event listener to select-all checkbox
    selectAllCheckbox.addEventListener("change", function () {
        checkboxes.forEach(function (checkbox) {
            checkbox.checked = selectAllCheckbox.checked;
        });
    });

    // Add event listener to each checkbox in tbody
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener("change", function () {
            // Check if all checkboxes in tbody are checked
            const allChecked = [...checkboxes].every(function (checkbox) {
                return checkbox.checked;
            });

            // Update select-all checkbox accordingly
            selectAllCheckbox.checked = allChecked;
        });
    });
});


/*------------------full screen Mode ------------------------*/
document.addEventListener("DOMContentLoaded", function () {
        const btnFullscreen = document.getElementById("btnFullscreen");

        // Function to toggle fullscreen mode
        function toggleFullScreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        }

        // Add click event listener to the button
        btnFullscreen.addEventListener("click", toggleFullScreen);
    });


    
// // Function to clear all input fields
// function clearInputFields() {
//     var inputs = document.querySelectorAll('input[type="text"], input[type="date"], textarea');
//     inputs.forEach(function (input) {
//         input.value = '';
//     });

//     var selects = document.querySelectorAll('select');
//     selects.forEach(function (select) {
//         select.selectedIndex = 0;
//     });
// }

// // Function to submit the form
// function submitForm() {
//     var form = document.querySelector('form');
//     form.submit();
// }

// // Function to remove 'required' attribute and message
// function addRequiredAndMessage() {
//     var inputs = document.querySelectorAll('input[type="text"], input[type="date"], textarea, select');
//     inputs.forEach(function (input) {
//         input.setAttribute('required', 'required');

//         var requiredMessage = document.createElement('span');
//         requiredMessage.textContent = 'Required';
//         requiredMessage.classList.add('required-message');
//         input.parentNode.appendChild(requiredMessage);
//     });
// }

// // Function to remove 'required' attribute and message
// function removeRequiredAndMessage() {
//     var inputs = document.querySelectorAll('input[type="text"][data-required="true"], input[type="date"][data-required="true"], textarea[data-required="true"]');
//     inputs.forEach(function (input) {
//         input.removeAttribute('required');
//         var requiredMessage = input.parentNode.querySelector('.required-message');
//         if (requiredMessage) {
//             input.parentNode.removeChild(requiredMessage);
//         }
//     });
// }

// // Function to display a popup message
// function showPopupMessage(message) {
//     alert(message);
// }

// // Event listener for cancel button
// document.getElementById('cancelButton').addEventListener('click', function () {
//     clearInputFields();
// });

// // Event listener for save button
// document.getElementById('saveButton').addEventListener('click', function () {
//     removeRequiredAndMessage(); // Clear previous "required" attributes and messages
//     addRequiredAndMessage(); // Add "required" attributes and messages as needed
//     submitForm();
//     showPopupMessage('Form submitted successfully!');
// });