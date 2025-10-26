import swal from 'sweetalert2'

export const showConfirmationModal = () => {
    swal.fire({
        title: "Bent u zeker?",
        showCancelButton: true,
        confirmButtonText: "Ja ik ben zeker",
        cancelButtonText: "Nee ik ben niet zeker",
    });
};