import { RequestEntity } from '@infra/postgres/entities';
import { formatDate } from 'date-fns';

export function buildRequestHtml(request: RequestEntity): string {
    const { id, organizationName, address, category, createdAt, author, email, phoneNumber } =
        request;

    return `    <p>Уважаемый(ая) Администратор!</p> <br>
    <p>В системе зарегистрирована новая заявка на размещение объекта на карте креативных индустрий.</p> <br>
    
    <h3>Информация об объекте:</h3>
    <ul>
        <li><strong>Название:</strong> ${organizationName}</li>
        <li><strong>Адрес:</strong> ${address}</li>
        <li><strong>Категория:</strong> ${category.name}</li>
        <li><strong>Дата подачи заявки:</strong> ${formatDate(createdAt, 'yyyy-MM-dd')}</li>
    </ul>
    <br>
    <h3>Контактные данные автора заявки:</h3>
    <ul>
        <li><strong>Имя:</strong> ${author}</li>
        <li><strong>Телефон:</strong> ${phoneNumber}</li>
        <li><strong>Email:</strong> ${email}</li>
    </ul>
    <br>
    
    <hr>
    <p><small>Это письмо было отправлено автоматически. Пожалуйста, не отвечайте на него.</small></p>`;
}
