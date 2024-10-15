document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('paymentPlanForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const newPlan = {
            name: document.getElementById('name').value,
            value: parseFloat(document.getElementById('value').value),
            numberDaysPerWeek: parseInt(document.getElementById('numberDaysPerWeek').value),
            description: document.getElementById('description').value,
        };

        createPaymentPlan(newPlan);
    });
});

function createPaymentPlan(plan) {
    fetch('/api/paymentPlan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(plan),
    })
    .then(response => {
        if (response.ok) {
            alert('Plano cadastrado com sucesso!'); // Alerta de sucesso
            document.getElementById('paymentPlanForm').reset(); // Limpa o formulário
        } else {
            alert('Erro ao cadastrar plano.'); // Alerta de erro
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao cadastrar plano.'); // Alerta de erro
    });
}
