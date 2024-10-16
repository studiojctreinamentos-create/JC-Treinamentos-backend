document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Função para inicializar a aplicação
async function initializeApp() {
    try {
        await Promise.all([fetchTrainees(), fetchPaymentPlans()]);
        setupFormEvents();
    } catch (error) {
        console.error('Erro ao inicializar a aplicação:', error);
    }
}

// Configura os eventos dos formulários
function setupFormEvents() {
    document.getElementById('updateForm').addEventListener('submit', handleTraineeUpdate);
    document.getElementById('updatePaymentPlanForm').addEventListener('submit', handlePaymentPlanUpdate);
}

// Busca trainees e popula a tabela
async function fetchTrainees() {
    try {
        const trainees = await fetchJson('/api/trainee');
        const paymentPlans = await fetchAllPaymentPlansForTrainees(trainees);
        populateTraineeTable(trainees, paymentPlans);
    } catch (error) {
        console.error('Erro ao carregar trainees:', error);
    }
}

// Busca planos de pagamento e popula a tabela
async function fetchPaymentPlans() {
    try {
        const paymentPlans = await fetchJson('/api/paymentPlan');
        populatePaymentPlanTable(paymentPlans);
        populatePaymentPlanSelect(paymentPlans);
    } catch (error) {
        console.error('Erro ao carregar planos de pagamento:', error);
    }
}

// Função auxiliar para buscar JSON
async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.statusText}`);
    }
    return response.json();
}

// Busca todos os planos de pagamento para trainees
async function fetchAllPaymentPlansForTrainees(trainees) {
    const requests = trainees.map(trainee => fetchJson(`/api/paymentPlan/${trainee.paymentPlanId}`));
    return Promise.all(requests);
}

// Popula a tabela de trainees
function populateTraineeTable(trainees, paymentPlans) {
    const tbody = document.querySelector('#traineeTable tbody');
    tbody.innerHTML = '';

    trainees.forEach((trainee, index) => {
        const planName = paymentPlans[index]?.name || 'N/A';
        const row = createTraineeRow(trainee, planName);
        tbody.appendChild(row);
    });
}

// Cria uma linha para a tabela de trainees
function createTraineeRow(trainee, planName) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${trainee.name}</td>
        <td>${formatDate(trainee.birthDate)}</td>
        <td>${trainee.cpf}</td>
        <td>${trainee.phone || 'N/A'}</td>
        <td>${trainee.emergencyContact || 'N/A'}</td>
        <td>${trainee.address || 'N/A'}</td>
        <td>${trainee.isActive ? 'Sim' : 'Não'}</td>
        <td>${planName}</td>
        <td>${trainee.paymentDay || 'N/A'}</td>
        <td>
            <button onclick='populateUpdateForm(${JSON.stringify(trainee)})'>Editar</button>
            <button onclick='deleteTrainee(${trainee.id})'>Deletar</button>
        </td>
    `;
    return row;
}

// Popula a tabela de planos de pagamento
function populatePaymentPlanTable(plans) {
    const tbody = document.querySelector('#paymentPlanTable tbody');
    tbody.innerHTML = '';

    plans.forEach(plan => {
        const row = createPaymentPlanRow(plan);
        tbody.appendChild(row);
    });
}

// Cria uma linha para a tabela de planos de pagamento
function createPaymentPlanRow(plan) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${plan.name}</td>
        <td>R$${plan.value.toFixed(2)}</td>
        <td>${plan.numberDaysPerWeek}</td>
        <td>${plan.description}
        <td>
            <button onclick="populatePaymentPlanForm('${plan.id}', '${plan.name}', '${plan.value}', '${plan.numberDaysPerWeek}', '${encodeURIComponent(plan.description)}')">Editar</button>
            <button onclick="deletePaymentPlan('${plan.id}')">Deletar</button>
        </td>
    `;
    return row;
}

// Popula o select de planos de pagamento
function populatePaymentPlanSelect(plans) {
    const select = document.getElementById('updatePaymentPlan');
    select.innerHTML = plans.map(plan => `<option value='${plan.id}'>${plan.name}</option>`).join('');
}

// Popula o formulário de atualização de trainee
function populateUpdateForm(trainee) {
    const {
        id, name, birthDate, cpf, phone, emergencyContact, address, isActive, paymentPlanId, paymentDay
    } = trainee;

    document.getElementById('updateId').value = id;
    document.getElementById('updateName').value = name;
    document.getElementById('updateBirthDate').value = formatDate(birthDate, true);
    document.getElementById('updateCpf').value = cpf;
    document.getElementById('updatePhone').value = phone || '';
    document.getElementById('updateEmergencyContact').value = emergencyContact || '';
    document.getElementById('updateAddress').value = address || '';
    document.getElementById('updateIsActive').value = isActive;
    document.getElementById('updatePaymentPlan').value = paymentPlanId || '';
    document.getElementById('updatePaymentDay').value = paymentDay || '';

    window.scrollTo(0, document.querySelector('.update-form').offsetTop);
}

// Popula o formulário de atualização de plano de pagamento
function populatePaymentPlanForm(id, name, value, numberDaysPerWeek, description) {
    document.getElementById('updatePaymentPlanId').value = id;
    document.getElementById('updatePaymentPlanName').value = name;
    document.getElementById('updatePaymentPlanValue').value = value;
    document.getElementById('updatePaymentPlanDays').value = numberDaysPerWeek;
    document.getElementById('updatePaymentPlanDescription').value = decodeURIComponent(description);

    window.scrollTo(0, document.querySelector('.update-payment-plan-form').offsetTop);
}

// Lida com a atualização de um trainee
async function handleTraineeUpdate(event) {
    event.preventDefault();
    const id = document.getElementById('updateId').value;
    const traineeData = {
        name: document.getElementById('updateName').value,
        birthDate: document.getElementById('updateBirthDate').value,
        cpf: document.getElementById('updateCpf').value,
        phone: document.getElementById('updatePhone').value,
        emergencyContact: document.getElementById('updateEmergencyContact').value,
        address: document.getElementById('updateAddress').value,
        isActive: document.getElementById('updateIsActive').value,
        paymentPlanId: document.getElementById('updatePaymentPlan').value,
        paymentDay: document.getElementById('updatePaymentDay').value,
    };

    try {
        await fetch(`/api/trainee/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(traineeData),
        });
        await fetchTrainees();
        clearTraineeForm();
    } catch (error) {
        console.error('Erro ao atualizar trainee:', error);
    }
}

// Lida com a atualização de um plano de pagamento
async function handlePaymentPlanUpdate(event) {
    event.preventDefault();
    const id = document.getElementById('updatePaymentPlanId').value;
    const paymentPlanData = {
        name: document.getElementById('updatePaymentPlanName').value,
        value: parseFloat(document.getElementById('updatePaymentPlanValue').value),
        numberDaysPerWeek: parseInt(document.getElementById('updatePaymentPlanDays').value, 10),
        description: document.getElementById('updatePaymentPlanDescription').value
    };

    try {
        await fetch(`/api/paymentPlan/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentPlanData),
        });
        await fetchPaymentPlans();
        clearPaymentPlanForm();
    } catch (error) {
        console.error('Erro ao atualizar plano de pagamento:', error);
    }
}

// Função para deletar um trainee
async function deleteTrainee(id) {
    if (confirm('Tem certeza que deseja deletar este trainee?')) {
        try {
            await fetch(`/api/trainee/${id}`, { method: 'DELETE' });
            await fetchTrainees();
        } catch (error) {
            console.error('Erro ao deletar trainee:', error);
        }
    }
}

// Função para deletar um plano de pagamento
async function deletePaymentPlan(id) {
    if (confirm('Tem certeza que deseja deletar este plano de pagamento?')) {
        try {
            await fetch(`/api/paymentPlan/${id}`, { method: 'DELETE' });
            await fetchPaymentPlans();
        } catch (error) {
            console.error('Erro ao deletar plano de pagamento:', error);
        }
    }
}

// Limpa o formulário de atualização de trainee
function clearTraineeForm() {
    document.getElementById('updateForm').reset();
    document.getElementById('updateIsActive').checked = false;
}

// Limpa o formulário de atualização de plano de pagamento
function clearPaymentPlanForm() {
    document.getElementById('updatePaymentPlanForm').reset();
}

// Formata a data para exibição ou para input[type="date"]
function formatDate(dateString, isInput = false) {
    const date = new Date(dateString);

    const adjustedDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

    if (isInput) {
        return adjustedDate.toISOString().split('T')[0];
    }
    return adjustedDate.toLocaleDateString('pt-BR');
}