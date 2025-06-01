from datetime import date, timedelta

from celery import shared_task
from django.core.mail import EmailMultiAlternatives

from aluno.models import AlunoPlano
from my_gym import settings


@shared_task
def email_send_expired():
    today = date.today()
    limit_date = today + timedelta(days=5)

    aluno_planos = AlunoPlano.objects.filter(
        data_vencimento__gte=today,
        data_vencimento__lte=limit_date,
        active=True,
    ).select_related("aluno", "plano__academia", "plano")

    for aluno_plano in aluno_planos:
        aluno = aluno_plano.aluno
        academia = aluno_plano.plano.academia
        vencimento = aluno_plano.data_vencimento

        assunto = f'Lembrete: Seu Plano na {academia.nome} Está Próximo do Vencimento!'

        html_content = f"""
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {{
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }}
                .container {{
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }}
                .header {{
                    background-color: #32CD32;
                    color: #ffffff;
                    text-align: center;
                    padding: 20px;
                }}
                .header h1 {{
                    margin: 0;
                    font-size: 24px;
                }}
                .content {{
                    padding: 30px;
                    color: #333333;
                    background-color: #ffffff;
                }}
                .content h2 {{
                    font-size: 20px;
                    margin-top: 0;
                    color: #32CD32;
                }}
                .content p {{
                    line-height: 1.6;
                    font-size: 16px;
                }}
                .cta-button {{
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #32CD32;
                    color: #ffffff !important;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 16px;
                    margin: 20px 0;
                    text-align: center;
                }}
                .footer {{
                    background-color: #f8f9fa;
                    text-align: center;
                    padding: 15px;
                    font-size: 14px;
                    color: #666666;
                }}
                .footer a {{
                    color: #32CD32;
                    text-decoration: none;
                }}
                @media only screen and (max-width: 600px) {{
                    .container {{
                        width: 100%;
                        margin: 0;
                    }}
                    .content {{
                        padding: 20px;
                    }}
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>MyGym</h1>
                </div>
                <div class="content">
                    <h2>Olá, {aluno.nome}!</h2>
                    <p>Está na hora de continuar sua jornada de saúde e bem-estar com a <strong>{academia.nome}</strong>!</p>
                    <p>Seu plano está próximo do vencimento, em <strong>{vencimento.strftime('%d/%m/%Y')}</strong>. Não perca tempo e renove agora para manter seus treinos em dia!</p>
                    <p>Entre em contato pelo numero: {academia.telefone} ou pelo email: {academia.email} para agendar seu pagamento</p>
                    <p>Qualquer dúvida? Nossa equipe está aqui para ajudar. Entre em contato!</p>
                </div>
                <div class="footer">
                    <p>© 2025 MyGym. Todos os direitos reservados.</p>
                </div>
            </div>
        </body>
        </html>
        """

        text_content = (
            f'Olá, {aluno.nome},\n\n'
            f'Seu plano na academia {academia.nome} vence em {vencimento.strftime("%d/%m/%Y")}.\n'
            f'Por favor, entre em contato com a academia para renovar seu plano.\n\n'
            f'>Entre em contato pelo numero: {academia.telefone} ou pelo email: {academia.email} para agendar seu pagamento\n\n'
            f'Atenciosamente,\nEquipe {academia.nome}'
        )

        email = EmailMultiAlternatives(
            subject=assunto,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[aluno.email],
        )
        email.attach_alternative(html_content, "text/html")
        email.send(fail_silently=False)