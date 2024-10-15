document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/paymentPlan')
        .then(response => response.json())
        .then(plans => {
            const paymentPlanSelect = document.getElementById('paymentPlan');
            plans.forEach(plan => {
                const option = document.createElement('option');
                option.value = plan.id;
                option.textContent = `${plan.name} - R$${plan.value} - ${plan.numberDaysPerWeek} Dias por semana`;
                paymentPlanSelect.appendChild(option);
            });
        })
        .catch(e => {
            console.error('erro ao carregar os planos de pagamento:', e);
        });
});

// Função para formatar o telefone
function formatPhone(value) {
    const numbers = value.replace(/\D/g, '');
    const match = numbers.match(/^(\d{2})(\d{5})(\d{0,4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
}

// Adiciona evento de input para formatar o telefone
document.getElementById('phone').addEventListener('input', function() {
    this.value = formatPhone(this.value);
});

// Adiciona evento de input para formatar o contato de emergência
document.getElementById('emergencyContact').addEventListener('input', function() {
    this.value = formatPhone(this.value);
});

document.getElementById('traineeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const phonePattern = /^\(\d{2}\) \d{5}-\d{4}$/; // Formato: (xx) xxxxx-xxxx
    const emergencyContactPattern = /^\(\d{2}\) \d{5}-\d{4}$/; // Formato: (xx) xxxxx-xxxx

    const phone = document.getElementById('phone').value;
    const emergencyContact = document.getElementById('emergencyContact').value;

    if (!phonePattern.test(phone)) {
        alert('O telefone deve estar no formato (xx) xxxxx-xxxx');
        return;
    }

    if (emergencyContact && !emergencyContactPattern.test(emergencyContact)) {
        alert('O contato de emergência deve estar no formato (xx) xxxxx-xxxx');
        return;
    }

    const data = JSON.stringify({
        name: document.getElementById('name').value,
        birthDate: document.getElementById('birthDate').value,
        cpf: document.getElementById('cpf').value,
        emergencyContact: emergencyContact,
        phone: phone,
        address: document.getElementById('address').value,
        paymentDay: document.getElementById('paymentDay').value,
        isActive: document.getElementById('isActive').value,
        paymentPlanId: document.getElementById('paymentPlan').value
    });

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/trainee');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 201) {
            alert('Dados Salvos com Sucesso!'); // Adicionando alerta de sucesso
            document.getElementById('traineeForm').reset(); // Limpa os campos do formulário
        } else {
            console.error('erro ao enviar dados:', xhr.statusText);
        }
    };
    xhr.onerror = function() {
        console.error('erro ao realizar a requisição');
    };

    xhr.send(data);
    console.log(data);
});
