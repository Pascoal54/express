   let cart = [];
let modalQt = 1;
let modalKey = 0;


const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);


//Função para salvar os dados no localSore
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Função para carregar o carrinho salvo no localStorage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart(); // Atualiza a interface com o carrinho carregado
    }
}

// Carrega os dados do carrinho ao inicializar o script
loadCartFromLocalStorage();

// Continua com o restante do código...


//listagem das pizzas

pizzaJson.map((item, index)=> {
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector(".pizza-item--img img").src = item.img;
    pizzaItem.querySelector(".pizza-item--price").innerHTML = `
    <strong>
        ${item.price.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }).replace('AOA', '').trim()} 
    </strong>
`;

    pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
    pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo .pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `
        <strong>
            ${pizzaJson[key].price.toLocaleString('pt-AO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kz
        </strong>
    `;
    
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {   
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];      
        });

        c('.pizzaInfo--qt').innerHTML = modalQt;

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=> {
            c('.pizzaWindowArea').style.opacity = 1;
        });
        
    });

    c('.pizza-area').append(pizzaItem); 
    
});

//eventos do modal
function closeModal() { 
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() =>{
        c('.pizzaWindowArea').style.display = 'none';    
    },500)
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

c('.pizzaInfo--qtmenos').addEventListener('click', () =>{
    if(modalQt >1){
        modalQt--;
    }    
    c('.pizzaInfo--qt').innerHTML = modalQt;
})

c('.pizzaInfo--qtmais').addEventListener('click', () =>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
})

cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{   
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');  
    } );       
});

c('.pizzaInfo--addButton').addEventListener('click', ()=> {
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item)=>  item.identifier == identifier);

    if(key > -1) {
        cart[key].qt += modalQt;
    } else {
    
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    }
    updateCart();
    closeModal();
});

c('.menu-openner').addEventListener('click', ()=>{
    if (cart.length > 0) {
        c('aside').style.left = '0';
    } 
});
c('.menu-closer').addEventListener('click', () =>{
    c('aside').style.left = '100vw';
})

// Update items carrinho para localStore
function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });

            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.05;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `
    <strong>${subtotal.toLocaleString('pt-AO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kz</strong>
`;
c('.desconto span:last-child').innerHTML = `
    <strong>${desconto.toLocaleString('pt-AO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kz</strong>
`;
c('.total span:last-child').innerHTML = `
    <strong>${total.toLocaleString('pt-AO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kz</strong>
`;

    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }

    saveCartToLocalStorage(); // Salva o carrinho no LocalStorage
}

console.log(localStorage.getItem('cart'));


function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart(); // Atualiza a interface com o carrinho carregado
    }
}
 
 

const searchInput = c('#search-input');

searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.toLowerCase();
    let found = false;

    cs('.pizza-item').forEach(item => {
        const name = item.querySelector('.pizza-item--name').textContent.toLowerCase();

        if (name.includes(searchValue)) {
            item.style.display = 'block';
            found = true;
        } else {
            item.style.display = 'none';
        }
    });

    if (!found) {
        c('.no-products').style.display = 'block';
    } else {
        c('.no-products').style.display = 'none';
    }
});



  // ... (código anterior permanece o mesmo até a função de finalizar compra)

// Função principal para finalizar compra (versão simplificada)
c('.cart--finalizar').addEventListener('click', () => {
    if (cart.length === 0) {
        Swal.fire('Carrinho Vazio', 'Adicione produtos antes de finalizar!', 'warning');
        return;
    }

    const hoje = new Date();
    const dataAtual = hoje.toISOString().split('T')[0];
    const horaAtual = hoje.toTimeString().substring(0, 5);

    Swal.fire({
    title: 'Confirmar Pedido',
    html: `
        <div class="form-container">
            <input type="text" id="nome" class="swal2-input" placeholder="Nome Completo*" required>
            <input type="tel" id="telefone" class="swal2-input" 
                   placeholder="Telefone* (ex: 954927635)" required
                   pattern="[0-9]{9}" 
                   title="Digite 9 dígitos (ex: 954927635)">
            <input type="text" id="localizacao" class="swal2-input" placeholder="Bairro/Município*" required>
            <input type="text" id="referencia" class="swal2-input" placeholder="Ponto de Referência">
            <div class="datetime-container">
                <input type="date" id="dataEntrega" class="swal2-input" 
                       value="${dataAtual}" min="${dataAtual}" required>
                <input type="time" id="horaEntrega" class="swal2-input" 
                       value="${horaAtual}" min="08:00" max="17:00" required>
            </div>
            <p style="font-size:12px; color:#666; margin-top:10px;">
                * Horário de entrega: 8h às 17h | Pagamento na entrega
            </p>
        </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Enviar Pedido',
    focusConfirm: false,
    preConfirm: () => {
        const fields = ['nome', 'telefone', 'localizacao', 'dataEntrega', 'horaEntrega'];
        const values = {};
        
        // Validação de campos obrigatórios
        for (const field of fields) {
            const element = Swal.getPopup().querySelector(`#${field}`);
            values[field] = element.value.trim();
            if (!values[field]) {
                Swal.showValidationMessage(`Campo obrigatório: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                return false;
            }
        }

        // Validação forte do telefone
        const telefoneLimpo = values.telefone.replace(/\D/g, '');
        if (!/^(9[1-9][0-9]{7}|2[1-9][0-9]{7})$/.test(telefoneLimpo)) {
            Swal.showValidationMessage('Telefone inválido. Use: 9xxxxxxxx ou 2xxxxxxxx');
            return false;
        }
        values.telefone = telefoneLimpo; // Armazena apenas números

        // Validação de horário comercial (8h-17h)
        const [hora, minutos] = values.horaEntrega.split(':').map(Number);
        if (hora < 8 || hora > 17 || (hora === 17 && minutos > 0)) {
            Swal.showValidationMessage('Horário de entrega deve ser entre 08:00 e 17:00');
            return false;
        }

        // Validação se a data é hoje, verifica se horário é futuro
        const agora = new Date();
        const dataEntrega = new Date(values.dataEntrega);
        
        if (dataEntrega.toDateString() === agora.toDateString()) {
            const horaAtual = agora.getHours();
            const minutosAtuais = agora.getMinutes();
            
            if (hora < horaAtual || (hora === horaAtual && minutos <= minutosAtuais)) {
                Swal.showValidationMessage('Para entregas hoje, escolha um horário futuro');
                return false;
            }
        }

        return {
            ...values,
            referencia: Swal.getPopup().querySelector('#referencia').value.trim()
        };
    }
}).then((result) => {
    if (result.isConfirmed) {
        const userData = result.value;
        
        // Confirmação final antes de enviar
        Swal.fire({
            title: 'Confirmar envio?',
            html: `
                <div style="text-align:left; margin:10px 0">
                    <p><strong>Data/Hora:</strong> ${userData.dataEntrega} às ${userData.horaEntrega}</p>
                    <p><strong>Telefone:</strong> ${userData.telefone}</p>
                    <p><strong>Local:</strong> ${userData.localizacao}</p>
                </div>
                <p style="font-size:14px">Você será redirecionado para o WhatsApp</p>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Enviar para WhatsApp',
            cancelButtonText: 'Corrigir dados'
        }).then((res) => {
            if (res.isConfirmed) {
                enviarPedidoWhatsApp(userData);
            }
        });
    }
});
});

// Função para enviar pedido via WhatsApp
function enviarPedidoWhatsApp(userData) {
    const phone = '244954827635'; // Número atualizado
    
    // Formata os itens do carrinho
    const itemsList = cart.map((item, i) => {
        const product = pizzaJson.find(p => p.id === item.id);
        const size = ['Pequena', 'Média', 'Grande'][item.size];
        return `➤ ${product.name} (${size}) - ${item.qt} un x ${product.price.toFixed(2)} Kz = ${(product.price * item.qt).toFixed(2)} Kz`;
    }).join('\n');

    // Calcula totais
    const subtotal = cart.reduce((sum, item) => sum + (pizzaJson.find(p => p.id === item.id).price * item.qt), 0);
    const desconto = subtotal * 0.05;
    const total = subtotal - desconto;

    // Mensagem formatada para WhatsApp
    const message = `*PEDIDO NETZAGE EXPRESS* \n\n` +
        `*DADOS DO CLIENTE*\n` +
        `👤 Nome: ${userData.nome}\n` +
        `📞 Telefone: ${userData.telefone}\n` +
        `📍 Local: ${userData.localizacao}\n` +
        `🔹 Referência: ${userData.referencia || 'Não informada'}\n` +
        `⏰ Entrega: ${userData.dataEntrega} às ${userData.horaEntrega}\n\n` +
        `*DETALHES DO PEDIDO*\n${itemsList}\n\n` +
        `*RESUMO DE VALORES*\n` +
        `Subtotal: ${subtotal.toFixed(2)} Kz\n` +
        `Desconto (5%): ${desconto.toFixed(2)} Kz\n` +
        `*TOTAL A PAGAR: ${total.toFixed(2)} Kz*\n\n` +
        `💵 *Forma de Pagamento:* Dinheiro na entrega\n\n` +
        `_Pedido gerado em ${new Date().toLocaleString()}_`;

    // Abre o WhatsApp
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    Swal.fire({
        title: 'Pedido Pronto!',
        html: `
            <div style="text-align:center">
                <p>Clique no botão abaixo para abrir o WhatsApp e enviar seu pedido:</p>
                <a href="${whatsappUrl}" target="_blank" style="
                    display: inline-block;
                    background: #25D366;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 5px;
                    text-decoration: none;
                    margin-top: 15px;
                    font-weight: bold;
                ">
                    Abrir WhatsApp
                </a>
                <p style="margin-top:20px;font-size:14px;color:#666">Após o envio, aguarde nossa confirmação!</p>
            </div>
        `,
        showConfirmButton: false,
        allowOutsideClick: false
    });

    // Limpa o carrinho após envio
    cart = [];
    updateCart();
    saveCartToLocalStorage();
}

// Botão de ajuda WhatsApp simplificado
document.getElementById("whatsappBtn").addEventListener("click", function(event) {
    event.preventDefault();
    
    Swal.fire({
        title: 'Atendimento ao Cliente',
        html: `
            <div style="text-align:center">
                <p>Fale conosco no WhatsApp:</p>
                <p style="font-size:1.2em;margin:10px 0"><strong>+244 954 927 635</strong></p>
                <p>Horário de atendimento:</p>
                <p>Seg-Sex: 08:00 - 20:00</p>
                <p>Sáb-Dom: 09:00 - 18:00</p>
                <a href="https://wa.me/244954827635" target="_blank" style="
                    display: inline-block;
                    background: #25D366;
                    color: white;
                    padding: 8px 15px;
                    border-radius: 5px;
                    text-decoration: none;
                    margin-top: 15px;
                ">
                    Abrir Conversa
                </a>
            </div>
        `,
        showConfirmButton: false,
        showCloseButton: true
    });
});
