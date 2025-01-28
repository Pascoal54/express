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

c('.cart--finalizar').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('O carrinho está vazio! Adicione produtos antes de finalizar a compra.');
        return;
    }

    // Data e hora atuais
    const hoje = new Date();
    const dataAtual = hoje.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const horaAtual = hoje.toTimeString().split(' ')[0]; // Formato HH:MM:SS

    // Recupera dados do usuário armazenados previamente
    const savedUserData = JSON.parse(localStorage.getItem('userData')) || {};

    Swal.fire({
        title: 'Finalizar Compra',
        html: `
            <div style="display: flex; flex-direction: column; gap: 4px; width: 100%; max-width: 400px; margin: 0 auto;">
                <!-- Nome Completo -->
                <input type="text" id="nome" class="swal2-input" placeholder="Nome Completo" value="${savedUserData.nome || ''}" style="padding: 10px; font-size: 1rem; border-radius: 8px; border: 1px solid #ccc; box-sizing: border-box;">

                <!-- Telefone -->
                <input type="tel" id="telefone" class="swal2-input" placeholder="Telefone" value="${savedUserData.telefone || ''}" style="padding: 10px; font-size: 1rem; border-radius: 8px; border: 1px solid #ccc; box-sizing: border-box;">

                <!-- Localização -->
                <input type="text" id="localizacao" class="swal2-input" placeholder="Localização" value="${savedUserData.localizacao || ''}" style="padding: 10px; font-size: 1rem; border-radius: 8px; border: 1px solid #ccc; box-sizing: border-box;">

                <!-- Referência -->
                <input type="text" id="referencia" class="swal2-input" placeholder="Referência (opcional)" value="${savedUserData.referencia || ''}" style="padding: 10px; font-size: 1rem; border-radius: 8px; border: 1px solid #ccc; box-sizing: border-box;">

                <!-- Data da Entrega -->
                <input type="date" id="dataEntrega" class="swal2-input" value="${dataAtual}" style="padding: 10px; font-size: 1rem; border-radius: 8px; border: 1px solid #ccc; box-sizing: border-box;">

                <!-- Hora da Entrega -->
                <input type="time" id="horaEntrega" class="swal2-input" value="${horaAtual}" style="padding: 10px; font-size: 1rem; border-radius: 8px; border: 1px solid #ccc; box-sizing: border-box;">
            </div>
        `,
        showCancelButton: true,
        cancelButtonText: 'Adicionar mais itens',
        confirmButtonText: 'Confirmar',
        preConfirm: () => {
            const nome = Swal.getPopup().querySelector('#nome').value.trim();
            const telefone = Swal.getPopup().querySelector('#telefone').value.trim();
            const localizacao = Swal.getPopup().querySelector('#localizacao').value.trim();
            const referencia = Swal.getPopup().querySelector('#referencia').value.trim();
            const dataEntrega = Swal.getPopup().querySelector('#dataEntrega').value.trim();
            const horaEntrega = Swal.getPopup().querySelector('#horaEntrega').value.trim();

            if (!nome || !telefone || !localizacao || !dataEntrega || !horaEntrega) {
                Swal.showValidationMessage(`Por favor, preencha todos os campos obrigatórios!`);
                return;
            }

            const dataSelecionada = new Date(dataEntrega);
            dataSelecionada.setHours(0, 0, 0, 0);
            const dataHoje = new Date();
            dataHoje.setHours(0, 0, 0, 0);

            if (dataSelecionada < dataHoje) {
                Swal.showValidationMessage(`A data de entrega não pode ser anterior à data atual!`);
                return;
            }

            if (horaEntrega < "08:00" || horaEntrega > "17:00") {
                Swal.showValidationMessage(`O horário de entrega deve estar entre 08:00 e 17:00!`);
                return;
            }

            return { nome, telefone, localizacao, referencia, dataEntrega, horaEntrega };
        },
        customClass: {
            popup: 'no-scroll'
        },
        didOpen: () => {
            document.querySelector('.swal2-popup').style.overflowY = 'hidden'; // Garantir que não haja barra de rolagem
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const userData = result.value;

            // Agora inclui os dados do carrinho na informação do comprovativo
            const produtos = cart.map(item => `${item.nome} - ${item.quantidade} x ${item.preco}`).join(', ');

            // Gera o comprovativo
            gerarComprovativo({
                ...userData,
                produtos
            });

            // Exibe mensagem de sucesso e limpa o carrinho
            Swal.fire({
                icon: "success",
                title: "Compra realizada com sucesso!",
                text: "O comprovativo foi enviado. Clique em 'OK' para revisar os detalhes no WhatsApp.",
                confirmButtonText: "OK",
            }).then((successResult) => {
                if (successResult.isConfirmed) {
                    cart = []; // Esvazia o carrinho
                    localStorage.removeItem('cart'); // Limpa o localStorage
                    updateCart(); // Atualiza a interface do carrinho
                    enviarParaWhatsApp(userData); // Redireciona para o WhatsApp
                }
            });
        }
    });
});





 // Função para gerar o comprovativo em PDF com jsPDF
function gerarComprovativo(userData) {
    const { jsPDF } = window.jspdf; // Acessando a biblioteca jsPDF
    const doc = new jsPDF();

    // Definindo cores
    const corFundo = [240, 240, 240]; // Cor de fundo suave (cinza claro)
    const corTexto = [0, 0, 0]; // Preto para o texto
    const corDestaque = [255, 215, 0]; // Cor dourada para destaque
    const corLinha = [200, 200, 200]; // Cor da linha separadora

    // Cor de fundo
    doc.setFillColor(...corFundo);
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

    // Configurações da logo
    const logoPath = './images/logo.png'; // Caminho para o logo
    const logoX = 10; // Posição X do logo
    const logoY = 15; // Posição Y do logo (ajustada)
    const logoWidth = 30; // Largura do logo
    const logoHeight = 30; // Altura do logo
    try {
        doc.addImage(logoPath, 'JPEG', logoX, logoY, logoWidth, logoHeight);
    } catch (error) {
        console.warn("Logo não carregada:", error); // Mensagem de fallback
    }

    // Cabeçalho
    const headerX = logoX + logoWidth + 10; // Ajusta o texto para o lado da logo
    const headerY = 25; // Alinhamento vertical ajustado
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...corDestaque);
    doc.text('Netzage Express', headerX, headerY);

    // Subtítulo "Comprovativo de Compra"
    doc.setFontSize(18);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...corTexto);
    doc.text('Comprovativo de Compra - Pagamento na Entrega', headerX, headerY + 10);

    // Linha separadora
    doc.setDrawColor(...corLinha);
    doc.line(10, 50, 200, 50);

    // Informações do usuário
    let yOffset = 60; // Ajustado para iniciar abaixo da linha separadora
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...corTexto);
    doc.text(`Nome: ${userData.nome}`, 10, yOffset);
    doc.text(`Telefone: ${userData.telefone}`, 10, yOffset + 10);
    doc.text(`Localização: ${userData.localizacao}`, 10, yOffset + 20);
    doc.text(`Referência: ${userData.referencia || 'N/A'}`, 10, yOffset + 30);
    doc.text(`Data de Entrega: ${userData.dataEntrega}`, 10, yOffset + 40);
    doc.text(`Hora de Entrega: ${userData.horaEntrega}`, 10, yOffset + 50);

    // Linha separadora para itens
    yOffset += 60;
    doc.setDrawColor(...corLinha);
    doc.line(10, yOffset, 200, yOffset);
    yOffset += 10;

    // Itens do carrinho
    doc.setFont("helvetica", "bold");
    doc.text('Itens do Carrinho:', 10, yOffset);
    yOffset += 10;

    cart.forEach((item, index) => {
        const pizza = pizzaJson.find(p => p.id === item.id); // Substitua pizzaJson por seus dados
        const pizzaName = `${pizza.name}`;
        const pizzaQty = item.qt;

        // Nome e quantidade
        doc.setFont("helvetica", "normal");
        doc.text(`${index + 1}. ${pizzaName} - Quantidade: ${pizzaQty}`, 10, yOffset);
        yOffset += 10;

        // Imagem do produto
        const img = pizza.image; // Supondo que tenha a imagem do produto
        if (img) {
            doc.addImage(img, 'JPEG', 150, yOffset - 10, 40, 40);
            yOffset += 40;
        }
    });

    // Valores totais
    let subtotal = cart.reduce((acc, item) => {
        const pizza = pizzaJson.find(p => p.id === item.id);
        return acc + pizza.price * item.qt;
    }, 0);
    let desconto = subtotal * 0.07; // 10% de desconto
    let total = subtotal - desconto;

    // Linha separadora para valores totais
    doc.setDrawColor(...corLinha);
    doc.line(10, yOffset, 200, yOffset);
    yOffset += 10;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...corTexto);
    doc.text(`Subtotal: Kz ${subtotal.toFixed(2)}`, 10, yOffset);
    yOffset += 10;
    doc.setFont("helvetica", "normal");
    doc.text(`Desconto: Kz ${desconto.toFixed(2)}`, 10, yOffset);
    yOffset += 10;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...corDestaque);
    doc.text(`Total: Kz ${total.toFixed(2)}`, 10, yOffset);

    // Linha separadora para informações de contato
    yOffset += 20;
    doc.setDrawColor(...corLinha);
    doc.line(10, yOffset, 200, yOffset);
    yOffset += 10;

    // Informações de contato
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...corTexto);
    doc.text('E-mail para contato: suporte.netzageexpress@gmail.com', 10, yOffset);
    yOffset += 10;
    doc.text('Telefone: +244 938 142 738', 10, yOffset);
    
     
    // Gera o arquivo PDF e converte para Base64
    const base64pdf = doc.output('datauristring');

    // Envia o PDF por e-mail via EmailJS
    enviarEmailComprovativo(userData, base64pdf);
    
    // Salva o PDF
    doc.save(`Comprovativo_Compra_${Date.now()}.pdf`);

     
} 
  
// Função para enviar o comprovativo por e-mail usando EmailJS e SweetAlert2
function enviarEmailComprovativo(userData, pdfUrl) {
    // Gera a lista de itens do carrinho
    const cartItems = cart.map((item) => {
        const pizza = pizzaJson.find((p) => p.id === item.id);
        return `${pizza.name} - Quantidade: ${item.qt}`;
    }).join("\n"); // Junta os itens como uma string formatada

    // Calcula o subtotal, desconto e total
    const subtotal = cart.reduce((acc, item) => {
        const pizza = pizzaJson.find((p) => p.id === item.id);
        return acc + pizza.price * item.qt;
    }, 0);
    
    const desconto = subtotal * 0.05; // 7% de desconto
    const total = subtotal - desconto;

    // Envia os dados para o EmailJS, incluindo os itens do carrinho, subtotal, desconto e total
    emailjs
        .send("NetzageExpress2025", "template_3xsf94e", {
            nome: userData.nome,
            telefone: userData.telefone,
            localizacao: userData.localizacao,
            referencia: userData.referencia || "N/A", // Caso não haja referência
            dataEntrega: userData.dataEntrega,
            horaEntrega: userData.horaEntrega,
            itensCarrinho: cartItems, // Itens do carrinho
            subtotal: `Kz ${subtotal.toFixed(2)}`, // Subtotal formatado
            desconto: `Kz ${desconto.toFixed(2)}`, // Desconto formatado
            total: `Kz ${total.toFixed(2)}`, // Total formatado
            pdf_comprovativo: pdfUrl, // Link do PDF gerado
        })
        .then((response) => {
            console.log("Comprovativo enviado com sucesso!", response);

            // Mensagem de sucesso estilizada com SweetAlert2
            Swal.fire({
                icon: "success",
                title: "Compra realizada com sucesso!",
                text: "O comprovativo foi enviado para o telefone. Clique em 'OK' para continuar e revisar os detalhes no WhatsApp.",
                confirmButtonText: "OK",
            }).then((result) => {
                // Somente redireciona para o WhatsApp se o usuário clicar em "OK"
                if (result.isConfirmed) {
                    enviarParaWhatsApp(userData);
                }
            });
        })
        .catch((error) => {
            console.error("Erro ao enviar comprovativo por e-mail:", error);

            // Mensagem de erro estilizada com SweetAlert2
            Swal.fire({
                icon: "error",
                title: "Erro ao enviar o comprovativo!",
                text: "Por favor, tente novamente.",
                confirmButtonText: "OK",
            });
        });
}


// Função para enviar os dados via WhatsApp
function enviarParaWhatsApp(userData) {
    const numeroWhatsApp = '950354803'; // Número de destino (com DDI e DDD se necessário)
    const mensagem = `
        *Olá, acabei de realizar um pedido e gostaria de confirmar os detalhes da entrega:*

        *Dados do Cliente:*
        - Nome: ${userData.nome}
        - Telefone: ${userData.telefone}
        - Localização: ${userData.localizacao}
        - Referência: ${userData.referencia || 'N/A'}

        *Detalhes da Entrega:*
        - Data: ${userData.dataEntrega}
        - Hora: ${userData.horaEntrega}

        *Itens do Pedido:*
        ${cart.map((item, index) => {
            const pizza = pizzaJson.find(p => p.id === item.id);
            const pizzaSize = item.size === 0 ? 'Pequena' : item.size === 1 ? 'Média' : 'Grande';
            return `${index + 1}. ${pizza.name} (${pizzaSize}) - Quantidade: ${item.qt}`;
        }).join('\n')}

        *Resumo do Pedido:*
        - Total: Kz ${cart.reduce((acc, item) => {
            const pizza = pizzaJson.find(p => p.id === item.id);
            return acc + pizza.price * item.qt;
        }, 0).toFixed(2)}

        Agradeço a confirmação e estou disponível para mais informações, caso necessário. Obrigado!
    `;

    // Formatação e redirecionamento para WhatsApp
    const urlWhatsApp = `https://wa.me/244${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhatsApp, '_blank'); // Abre o WhatsApp em uma nova aba
}
























 // Seleciona o botão de WhatsApp
const whatsappBtn = document.getElementById("whatsappBtn");

// Ao clicar no botão, mostra o SweetAlert2 com a pergunta
whatsappBtn.addEventListener("click", function(event) {
    event.preventDefault(); // Evita o link de ser clicado diretamente

    // Exibe o SweetAlert2 perguntando se deseja receber ajuda
    Swal.fire({
        title: 'Deseja receber ajuda no WhatsApp?',
        text: 'Clique em "Sim" para iniciar a conversa!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // Mensagem personalizada para enviar no WhatsApp
            const mensagem = encodeURIComponent('Olá, gostaria de mais informações sobre os produtos ou serviços oferecidos no site.');


            // Redireciona para o WhatsApp com a mensagem personalizada
            window.location.href = `https://wa.me/244950354803?text=${mensagem}`;
        }
    });
});
