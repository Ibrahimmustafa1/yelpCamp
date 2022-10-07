(() => {
    'use strict'

    const forms = document.querySelectorAll('.validated-form')
    console.log(forms)
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
   
})()