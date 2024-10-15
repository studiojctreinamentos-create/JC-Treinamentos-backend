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
    console.log(JSON.stringify(trainee))
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
            <button onclick='deleteTrainee('${trainee.id}')'>Deletar</button>
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
        <td>R$${plan.value}</td>
        <td>${plan.numberDaysPerWeek}</td>
        <td>
            <button onclick="populatePaymentPlanForm('${plan.id}', '${plan.name}', '${plan.value}', '${plan.numberDaysPerWeek}')">Editar</button>
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
    document.getElementById('updateIsActive').checked = isActive; // Ajustado para ser um checkbox
    document.getElementById('updatePaymentPlan').value = paymentPlanId || '';
    document.getElementById('updatePaymentDay').value = paymentDay || '';

    window.scrollTo(0, document.querySelector('.update-form').offsetTop);
}

function populatePaymentPlanForm(id, name, value, numberDaysPerWeek) {
    document.getElementById('updatePaymentPlanId').value = id;
    document.getElementById('updatePaymentPlanName').value = name;
    document.getElementById('updatePaymentPlanValue').value = value;
    document.getElementById('updatePaymentPlanDays').value = numberDaysPerWeek;

    window.scrollTo(0, document.querySelector('.update-payment-plan-form').offsetTop);
}

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
        isActive: document.getElementById('updateIsActive').checked, // Ajustado para checkbox
        paymentPlanId: document.getElementById('updatePaymentPlan').value,
        paymentDay: document.getElementById('updatePaymentDay').value,
    };

    try {
        await fetch(`/api/trainee/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(traineeData),
        });
        await fetchTrainees(); // Atualiza a lista de trainees
        clearTraineeForm();
    } catch (error) {
        console.error('Erro ao atualizar trainee:', error);
    }
}

// Função para lidar com a atualização de plano de pagamento
async function handlePaymentPlanUpdate(event) {
    event.preventDefault();
    const id = document.getElementById('updatePaymentPlanId').value;
    const paymentPlanData = {
        name: document.getElementById('updatePaymentPlanName').value,
        value: document.getElementById('updatePaymentPlanValue').value,
        numberDaysPerWeek: document.getElementById('updatePaymentPlanDays').value,
    };

    try {
        await fetch(`/api/paymentPlan/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentPlanData),
        });
        await fetchPaymentPlans(); // Atualiza a lista de planos de pagamento
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
            await fetchTrainees(); // Atualiza a lista de trainees
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
            await fetchPaymentPlans(); // Atualiza a lista de planos de pagamento
        } catch (error) {
            console.error('Erro ao deletar plano de pagamento:', error);
        }
    }
}

// Limpa o formulário de atualização de trainee
function clearTraineeForm() {
    document.getElementById('updateId').value = '';
    document.getElementById('updateName').value = '';
    document.getElementById('updateBirthDate').value = '';
    document.getElementById('updateCpf').value = '';
    document.getElementById('updatePhone').value = '';
    document.getElementById('updateEmergencyContact').value = '';
    document.getElementById('updateAddress').value = '';
    document.getElementById('updateIsActive').checked = false; // Limpa checkbox
    document.getElementById('updatePaymentPlan').value = '';
    document.getElementById('updatePaymentDay').value = '';
}

// Limpa o formulário de atualização de plano de pagamento
function clearPaymentPlanForm() {
    document.getElementById('updatePaymentPlanId').value = '';
    document.getElementById('updatePaymentPlanName').value = '';
    document.getElementById('updatePaymentPlanValue').value = '';
    document.getElementById('updatePaymentPlanDays').value = '';
}

function formatDate(dateString, isInput = false) {
    const date = new Date(dateString);

    const adjustedDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

    if (isInput) {
        return adjustedDate.toISOString().split('T')[0];
    }
    return adjustedDate.toLocaleDateString('pt-BR');
}