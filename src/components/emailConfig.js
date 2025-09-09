// emailConfig.js
// Configuração do EmailJS para envio de emails

// ⚠️ INSTRUÇÕES DE CONFIGURAÇÃO:
// 1. Crie uma conta em https://www.emailjs.com/
// 2. Configure um serviço de email (Gmail, Outlook, etc)
// 3. Crie um template de email
// 4. Substitua os valores abaixo com suas credenciais

export const EMAILJS_CONFIG = {
    // Encontre em: Email Services → Your Service → Service ID
    SERVICE_ID: 'service_jwn1e6b',
    
    // Encontre em: Email Templates → Your Template → Template ID
    TEMPLATE_ID: 'template_vxyv9tf',
    
    // Encontre em: Account → API Keys → Public Key
    PUBLIC_KEY: 'PE8FLDWWyftdGvl_f',
    
    // Configurações adicionais
    SETTINGS: {
      // Tempo de expiração do código em minutos
      CODE_EXPIRATION_MINUTES: 15,
      
      // Tamanho do código de recuperação
      CODE_LENGTH: 6,
      
      // Permitir reenvio de código após X segundos
      RESEND_COOLDOWN_SECONDS: 60,
      
      // Email do remetente (opcional)
      FROM_EMAIL: 'noreply@activelearn.com',
      FROM_NAME: 'ActiveLearn Hub'
    }
  };
  
  // Template de email em HTML (caso queira usar programaticamente)
  export const EMAIL_TEMPLATES = {
    passwordRecovery: {
      subject: 'Recuperação de Senha - ActiveLearn Hub',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; }
            .code-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; font-family: monospace; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Recuperação de Senha</h1>
            </div>
            <div class="content">
              <p>Olá <strong>{{user_name}}</strong>,</p>
              
              <p>Recebemos uma solicitação para redefinir a senha da sua conta no ActiveLearn Hub.</p>
              
              <div class="code-box">
                <p style="margin: 0 0 10px 0; color: #666;">Seu código de recuperação é:</p>
                <div class="code">{{recovery_code}}</div>
                <p style="margin: 10px 0 0 0; color: #999; font-size: 14px;">Válido por 15 minutos</p>
              </div>
              
              <p><strong>Como usar este código:</strong></p>
              <ol>
                <li>Volte para a página de login</li>
                <li>Digite o código acima quando solicitado</li>
                <li>Crie sua nova senha</li>
              </ol>
              
              <p style="color: #e74c3c; margin-top: 20px;">
                <strong>⚠️ Importante:</strong> Se você não solicitou esta recuperação, ignore este email e sua senha permanecerá inalterada.
              </p>
              
              <div class="footer">
                <p>Este é um email automático, por favor não responda.</p>
                <p>© 2024 ActiveLearn Hub - Todos os direitos reservados</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Olá {{user_name}},
        
        Você solicitou a recuperação de senha para sua conta no ActiveLearn Hub.
        
        Seu código de recuperação é: {{recovery_code}}
        
        Este código é válido por 15 minutos.
        
        Se você não solicitou esta recuperação, ignore este email.
        
        Atenciosamente,
        Equipe ActiveLearn Hub
      `
    },
    
    passwordChanged: {
      subject: 'Senha Alterada com Sucesso - ActiveLearn Hub',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; }
            .success-box { background: #e6ffed; border: 1px solid #22c55e; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Senha Alterada</h1>
            </div>
            <div class="content">
              <p>Olá <strong>{{user_name}}</strong>,</p>
              
              <div class="success-box">
                <p style="margin: 0; color: #16a34a;">
                  <strong>Sua senha foi alterada com sucesso!</strong>
                </p>
              </div>
              
              <p>Esta mensagem confirma que a senha da sua conta no ActiveLearn Hub foi alterada.</p>
              
              <p><strong>Data e hora:</strong> {{change_date}}</p>
              
              <p style="color: #e74c3c; margin-top: 20px;">
                <strong>⚠️ Não foi você?</strong><br>
                Se você não fez esta alteração, entre em contato conosco imediatamente.
              </p>
              
              <div class="footer">
                <p>Este é um email automático, por favor não responda.</p>
                <p>© 2024 ActiveLearn Hub - Todos os direitos reservados</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    }
  };
  
  // Função auxiliar para validar configuração
  export function validateEmailConfig() {
    const errors = [];
    
    if (EMAILJS_CONFIG.SERVICE_ID === 'SEU_SERVICE_ID') {
      errors.push('SERVICE_ID não configurado');
    }
    
    if (EMAILJS_CONFIG.TEMPLATE_ID === 'SEU_TEMPLATE_ID') {
      errors.push('TEMPLATE_ID não configurado');
    }
    
    if (EMAILJS_CONFIG.PUBLIC_KEY === 'SEU_PUBLIC_KEY') {
      errors.push('PUBLIC_KEY não configurado');
    }
    
    if (errors.length > 0) {
      console.warn('⚠️ EmailJS não está configurado corretamente:');
      errors.forEach(error => console.warn(`  - ${error}`));
      console.warn('📧 Modo desenvolvimento: códigos serão exibidos na tela');
      return false;
    }
    
    return true;
  }
  
  // Exportar função para enviar emails
  export async function sendEmail(type, params) {
    try {
      // Importar EmailJS dinamicamente
      const emailjs = await import('@emailjs/browser');
      
      // Inicializar com a public key
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
      
      // Enviar email
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        params
      );
      
      return { success: true, response };
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return { success: false, error };
    }
  }