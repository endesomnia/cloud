'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  isMounted: boolean;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  isMounted: false,
  t: (key: string) => key
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

const translations = {
  en: {
    // Home page
    'secure_storage': 'Secure Storage',
    'access_anywhere': 'Access Anywhere',
    'fast_upload': 'Fast Upload',
    'create_account': 'Create Account',
    'sign_in': 'Sign In',
    'experience_future': 'Experience the future of cloud storage',
    'personal_cloud': 'Your personal cloud storage solution',
    
    // Auth
    'welcome_back': 'Welcome Back',
    'enter_credentials': 'Enter your credentials to continue',
    'email': 'Email',
    'password': 'Password',
    'full_name': 'Full Name',
    'sign_up_title': 'Create Account',
    'sign_up_subtitle': 'Sign up for your free account today',
    'already_account': 'Already have an account?',
    'no_account': 'Don\'t have an account?',
    'create_account_button': 'Create account',
    'or': 'Or',
    'continue_with_github': 'Continue with GitHub',
    'this_field_required': 'This field is required',
    
    // Theme and Language
    'dark_theme': 'Enable dark theme',
    'light_theme': 'Enable light theme',
    'english': 'English',
    'russian': 'Russian',
    
    // File operations
    'upload_file': 'Upload File',
    'create_folder': 'Create Folder',
    'rename_file': 'Rename File',
    'move_file': 'Move File',
    'error': 'Error',
    
    // File upload
    'select_file_to_upload': 'Select a file to upload',
    'missing_bucket_name': 'Missing bucket name',
    'error_uploading_file': 'Error uploading file',
    'file_uploaded': 'File uploaded!',
    'upload_file_to': 'Upload file to',
    'drag_file_or_click': 'Drag file or click to select',
    'max_file_size': 'Maximum file size:',
    'uploaded': 'Uploaded!',
    
    // File rename
    'renaming_file': 'File Renaming',
    'renaming_file_in': 'Renaming file {filename} in folder {bucketName}',
    'new_filename': 'New filename',
    'enter_new_filename': 'Enter new filename',
    'renamed': 'Renamed!',
    'file_not_found': 'File not found',
    'error_renaming': 'Error renaming file',
    'specify_new_name': 'Specify a new filename',
    
    // File move
    'move_file_description': 'Move file',
    'from_bucket': 'from folder',
    'select_bucket': 'Select Folder',
    'files_and_folders': 'Files and Folders',
    'select_bucket_first': 'Select a folder first',
    'loading_buckets': 'Loading folders...',
    'no_buckets': 'No available folders',
    'loading_content': 'Loading content...',
    'empty_folder': 'The folder is empty',
    'root_directory': 'Root directory',
    'moved_successfully': 'Moved successfully!',
    'error_moving_file': 'Error moving file',
    'file_moved': 'File moved!',
    'file_moved_description': 'File "{name}" has been moved to "{bucket}"',
    'loading': 'Loading...',
    'move_file_button': 'Move file',
    'file_already_in_this_bucket': 'File already in this folder',
    'please_specify_bucket_name': 'Please specify a bucket name',
    
    // Buckets page
    'your_buckets': 'Your Buckets',
    'loading_buckets_page': 'Loading folders...',
    'buckets_not_found': 'Buckets not found',
    'create_first_bucket': 'Create your first bucket to organize files',
    'clear_search': 'Clear search',
    'reset_filters': 'Reset filters',
    'sort_by': 'Sort by',
    'filter': 'Filter',
    'name_asc': 'Name (A-Z)',
    'name_desc': 'Name (Z-A)',
    'date_asc': 'Date (Oldest first)',
    'date_desc': 'Date (Newest first)',
    'size_asc': 'Size (Smallest first)',
    'size_desc': 'Size (Largest first)',
    'all_buckets': 'All folders',
    'empty_buckets': 'Empty folders',
    'non_empty_buckets': 'Non-empty folders',
    'search_buckets': 'Search folders...',
    'search': 'Search',
    'filters': 'Filters',
    'sort': 'Sort',
    'grid_view': 'Grid view',
    'list_view': 'List view',
    'available': 'Available',
    'files': 'files',
    'name': 'Name',
    'status': 'Status',
    'creation_date': 'Creation date',
    'actions': 'Actions',
    'no_matching_buckets': 'No matching buckets found',
    'go_to_files': 'Go to Files',
    'delete_bucket': 'Delete Folder',

    // Starred page
    'starred_items': 'Starred Items',
    'loading_starred': 'Loading starred items...',
    'no_starred_items': 'No starred items found',
    'files_will_appear_here_starred': 'Your starred files and folders will appear here',
    'remove_from_starred': 'Remove from starred',
    'search_starred': 'Search starred items...',
    'type_asc': 'Type (A-Z)',
    'type_desc': 'Type (Z-A)',
    'all_items': 'All items',
    'files_only': 'Files only',
    'folders_only': 'Folders only',
    'no_matching_starred_files': 'No matching starred items found',
    
    // Shared page
    'shared': 'Shared',
    'shared_with_me': 'Shared with me',
    'shared_by_me': 'Shared by me',
    'loading_shared_files': 'Loading shared files',
    'from': 'From',
    'to': 'To',
    'added': 'Added',
    'path': 'Path',
    'no_shared_files_with_me': 'No files shared with you',
    'nobody_shared_with_you': 'Nobody has shared any files with you yet',
    'files_will_appear_here': 'Files shared with you will appear here',
    'no_shared_files_by_me': 'You haven\'t shared any files',
    'you_not_shared_with_others': 'You haven\'t shared any files with others',
    'share_files_to_appear_here': 'Share files with others to see them here',
    'shared_by': 'Shared by',
    'shared_to': 'Shared to',
    'unknown': 'Unknown',
    'shared_items': 'Shared Items',
    'loading_shared': 'Loading shared items...',
    'no_shared_items': 'No shared items found',
    'remove_shared_access': 'Remove shared access',
    'search_shared': 'Search shared items...',
    
    // Bucket files page
    'files_not_found': 'Files not found',
    'no_files_in_bucket': 'There are no files in this bucket',
    'upload_your_first_file': 'Upload your first file to get started',
    'all_files': 'All files',
    'large_files': 'Large files',
    'medium_files': 'Medium files',
    'small_files': 'Small files',
    'no_matching_files': 'No matching files found',
    'back_to_buckets': 'Back to buckets',
    'type': 'Type',
    'size': 'Size',
    'last_modified': 'Last modified',
    'bucket_files': 'Folder: {bucketName}',
    'loading_files': 'Loading files...',
    'no_files_found': 'No files found',
    'search_files': 'Search files...',
    'current_path': 'Current path: {path}',
    'file_size': 'Size: {size}',
    'file_last_modified': 'Last modified: {date}',
    'upload_to_current': 'Upload to current folder',
    'create_folder_here': 'Create folder here',
    'file_actions': 'File actions',
    'file_preview': 'Preview',
    'file_download': 'Download',
    'file_delete': 'Delete',
    'folder': 'Folder',
    'file': 'File',
    
    // User page
    'overview': 'Overview',
    'settings': 'Settings',
    'storage_usage': 'Storage Usage',
    'of': 'of',
    'used': 'used',
    'statistics': 'Statistics',
    'files_uploaded': 'Files uploaded',
    'files_downloaded': 'Files downloaded',
    'files_deleted': 'Files deleted',
    'storage_by_type': 'Storage by type',
    'images': 'Images',
    'documents': 'Documents',
    'videos': 'Videos',
    'other': 'Other',
    'activity': 'Activity',
    'week_activity': 'Week activity',
    'profile': 'Profile',
    'personal_info': 'Personal information',
    'edit_profile': 'Edit profile',
    'save_changes': 'Save changes',
    'notifications': 'Notifications',
    'security': 'Security',
    'two_factor_auth': 'Two-factor authentication',
    'enable': 'Enable',
    'disable': 'Disable',
    'last_active': 'Last active',
    'sign_out': 'Sign out',
    'user_account': 'User Account',
    'user_settings': 'User Settings',
    'update_profile': 'Update Profile',
    'profile_overview': 'Profile Overview',
    'account_settings': 'Account Settings',
    'username': 'Username',
    'change_avatar': 'Change Avatar',
    'update_info': 'Update Information',
    'appearance': 'Appearance',
    'theme': 'Theme',
    'light': 'Light',
    'dark': 'Dark',
    'language_setting': 'Language',
    'total_storage': 'Total Storage',
    'used_storage': 'Used Storage',
    'free_storage': 'Free Storage',
    'upgrade_plan': 'Upgrade Plan',
    'account_activity': 'Account Activity',
    'recent_activity': 'Recent Activity',
    'login_history': 'Login History',
    'cancel': 'Cancel',
    'gb': 'GB',
    'personal_data': 'Personal Data',
    'delete_account': 'Delete Account',
    'attach_github': 'Connect GitHub',
    'user': 'User',
    'back': 'Back',
    'file_types': 'File Types',
    
    // Bucket create
    'bucket_creation': 'Create Folder',
    'create_bucket_description': 'Create a new folder to store your files',
    'bucket_name': 'Folder name',
    'bucket_name_required': 'Folder name is required',
    'bucket_name_min_length': 'Folder name must be at least 3 characters',
    'bucket_name_placeholder': 'For example: My Documents',
    'access_mode': 'Access Mode',
    'private': 'Private',
    'only_for_you': 'Only for you',
    'public': 'Public',
    'accessible_by_link': 'Accessible by link',
    'bucket_creation_error': 'Error creating folder',
    'bucket_created': 'Folder created!',
    'bucket_created_description': 'Folder "{name}" created successfully',
    'bucket_name_empty': 'Folder name cannot be empty',
    'created': 'Created!',
    'creating': 'Creating...',
    'files_in_folder': 'File management in folder',
    'rename_button': 'Rename',
    'move_button': 'Move',
    'delete_button': 'Delete',
    'delete_file': 'Delete file',
    'delete_file_confirm': 'Delete file?',
    'delete_file_confirmation': 'Are you sure you want to delete file',
    'action_cannot_be_undone': 'This action cannot be undone.',
    'file_deleted': 'File deleted',
    'file_deleted_successfully': 'File successfully deleted',
    'error_deleting_file': 'Error deleting file',
    'missing_data_for_delete': 'Missing data for file deletion',
    'download_file': 'Download file',
    'download_button': 'Download',

    // Sidebar
    'dashboard': 'Dashboard',
    'folders': 'Folders',
    'starred': 'Starred',
    'sharing': 'Sharing',
    'shared_with': 'Shared with me',
    'preferences': 'Preferences',
  },
  ru: {
    // Главная страница
    'secure_storage': 'Безопасное хранение',
    'access_anywhere': 'Доступ отовсюду',
    'fast_upload': 'Быстрая загрузка',
    'create_account': 'Создать аккаунт',
    'sign_in': 'Войти',
    'experience_future': 'Испытайте будущее облачного хранения',
    'personal_cloud': 'Ваше персональное облачное хранилище',
    
    // Авторизация
    'welcome_back': 'С возвращением',
    'enter_credentials': 'Введите свои данные для входа',
    'email': 'Email',
    'password': 'Пароль',
    'full_name': 'Полное имя',
    'sign_up_title': 'Создание аккаунта',
    'sign_up_subtitle': 'Зарегистрируйтесь для бесплатного использования',
    'already_account': 'Уже есть аккаунт?',
    'no_account': 'Нет аккаунта?',
    'create_account_button': 'Создать аккаунт',
    'or': 'Или',
    'continue_with_github': 'Продолжить с GitHub',
    'this_field_required': 'Это поле обязательно',
    
    // Тема и язык
    'dark_theme': 'Включить темную тему',
    'light_theme': 'Включить светлую тему',
    'english': 'Английский',
    'russian': 'Русский',
    
    // Операции с файлами
    'upload_file': 'Загрузить файл',
    'create_folder': 'Создать папку',
    'rename_file': 'Переименовать файл',
    'move_file': 'Переместить файл',
    'error': 'Ошибка',
    
    // Загрузка файла
    'select_file_to_upload': 'Выберите файл для загрузки',
    'missing_bucket_name': 'Отсутствует название папки',
    'error_uploading_file': 'Ошибка при загрузке файла',
    'file_uploaded': 'Файл загружен!',
    'upload_file_to': 'Загрузите файл в',
    'drag_file_or_click': 'Перетащите файл или нажмите для выбора',
    'max_file_size': 'Максимальный размер:',
    'uploaded': 'Загружено!',
    
    // Переименование файла
    'renaming_file': 'Переименование файла',
    'renaming_file_in': 'Переименование файла {filename} в папке {bucketName}',
    'new_filename': 'Новое имя файла',
    'enter_new_filename': 'Введите новое имя файла',
    'renamed': 'Переименовано!',
    'file_not_found': 'Файл не найден',
    'error_renaming': 'Ошибка при переименовании файла',
    'specify_new_name': 'Укажите новое имя файла',
    
    // Перемещение файла
    'move_file_description': 'Переместить файл',
    'select_bucket': 'Выберите папку',
    'files_and_folders': 'Файлы и папки',
    'select_bucket_first': 'Сначала выберите папку',
    'loading_buckets': 'Загрузка папок...',
    'no_buckets': 'Нет доступных папок',
    'loading_content': 'Загрузка содержимого...',
    'empty_folder': 'Папка пуста',
    'root_directory': 'Корневая директория',
    'moved_successfully': 'Успешно перемещено!',
    'error_moving_file': 'Ошибка при перемещении файла',
    'file_moved': 'Файл перемещен!',
    'file_moved_description': 'Файл "{name}" был перемещен в "{bucket}"',
    'loading': 'Загрузка...',
    
    // Страница папок
    'your_buckets': 'Ваши папки',
    'loading_buckets_page': 'Загрузка папок...',
    'buckets_not_found': 'Папки не найдены',
    'create_first_bucket': 'Создайте свою первую папку для организации файлов',
    'clear_search': 'Очистить поиск',
    'reset_filters': 'Сбросить фильтры',
    'sort_by': 'Сортировать по',
    'filter': 'Фильтр',
    'name_asc': 'Имя (А-Я)',
    'name_desc': 'Имя (Я-А)',
    'date_asc': 'Дата (Сначала старые)',
    'date_desc': 'Дата (Сначала новые)',
    'size_asc': 'Размер (Сначала маленькие)',
    'size_desc': 'Размер (Сначала большие)',
    'all_buckets': 'Все папки',
    'empty_buckets': 'Пустые папки',
    'non_empty_buckets': 'Непустые папки',
    'search_buckets': 'Поиск папок...',
    'search': 'Поиск',
    'filters': 'Фильтры',
    'sort': 'Сортировка',
    'grid_view': 'Вид сеткой',
    'list_view': 'Вид списком',
    'available': 'Доступна',
    'files': 'файл(ов)',
    'name': 'Название',
    'status': 'Статус',
    'creation_date': 'Дата создания',
    'actions': 'Действия',
    'no_matching_buckets': 'По вашему запросу ничего не найдено',
    'go_to_files': 'Перейти к файлам',
    'delete_bucket': 'Удалить папку',
    
    // Страница избранного
    'starred_items': 'Избранные элементы',
    'loading_starred': 'Загрузка избранных элементов...',
    'no_starred_items': 'Избранные элементы не найдены',
    'files_will_appear_here_starred': 'Избранные файлы и папки будут отображаться здесь',
    'remove_from_starred': 'Удалить из избранного',
    'search_starred': 'Поиск в избранном...',
    'type_asc': 'Тип (А-Я)',
    'type_desc': 'Тип (Я-А)',
    'all_items': 'Все элементы',
    'files_only': 'Только файлы',
    'folders_only': 'Только папки',
    'no_matching_starred_files': 'По вашему запросу в избранном ничего не найдено',
    
    // Страница общих файлов
    'shared': 'Общие файлы',
    'shared_with_me': 'Доступные мне',
    'shared_by_me': 'Расшаренные мной',
    'loading_shared_files': 'Загрузка общих файлов',
    'from': 'От',
    'to': 'Кому',
    'added': 'Добавлен',
    'path': 'Путь',
    'no_shared_files_with_me': 'Нет доступных вам файлов',
    'nobody_shared_with_you': 'Никто не предоставил вам доступ к файлам',
    'files_will_appear_here': 'Файлы с общим доступом будут отображаться здесь',
    'no_shared_files_by_me': 'Вы не расшарили ни одного файла',
    'you_not_shared_with_others': 'Вы не предоставили доступ к файлам другим пользователям',
    'share_files_to_appear_here': 'Предоставьте доступ к файлам, чтобы они отображались здесь',
    'shared_by': 'Поделился',
    'shared_to': 'Доступно',
    'unknown': 'Неизвестно',
    'shared_items': 'Общие элементы',
    'loading_shared': 'Загрузка общих элементов...',
    'no_shared_items': 'Общие элементы не найдены',
    'remove_shared_access': 'Удалить общий доступ',
    'search_shared': 'Поиск общих элементов...',
    
    // Страница файлов в папке
    'files_not_found': 'Файлы не найдены',
    'no_files_in_bucket': 'В этой папке нет файлов',
    'upload_your_first_file': 'Загрузите ваш первый файл, чтобы начать',
    'all_files': 'Все файлы',
    'large_files': 'Большие файлы',
    'medium_files': 'Средние файлы',
    'small_files': 'Маленькие файлы',
    'back_to_buckets': 'Назад к папкам',
    'type': 'Тип',
    'size': 'Размер',
    'last_modified': 'Последнее изменение',
    'bucket_files': 'Папка: {bucketName}',
    'loading_files': 'Загрузка файлов...',
    'no_files_found': 'Файлы не найдены',
    'search_files': 'Поиск файлов...',
    'current_path': 'Текущий путь: {path}',
    'file_size': 'Размер: {size}',
    'file_last_modified': 'Последнее изменение: {date}',
    'upload_to_current': 'Загрузить в текущую папку',
    'create_folder_here': 'Создать папку здесь',
    'file_actions': 'Действия с файлом',
    'file_preview': 'Просмотр',
    'file_download': 'Скачать',
    'file_delete': 'Удалить',
    'folder': 'Папка',
    'file': 'Файл',
    
    // Страница пользователя
    'overview': 'Обзор',
    'settings': 'Настройки',
    'storage_usage': 'Использование хранилища',
    'of': 'из',
    'used': 'использовано',
    'statistics': 'Статистика',
    'files_uploaded': 'Файлов загружено',
    'files_downloaded': 'Файлов скачано',
    'files_deleted': 'Файлов удалено',
    'storage_by_type': 'Хранилище по типам',
    'images': 'Изображения',
    'documents': 'Документы',
    'videos': 'Видео',
    'other': 'Другое',
    'activity': 'Активность',
    'week_activity': 'Активность за неделю',
    'profile': 'Профиль',
    'personal_info': 'Личная информация',
    'edit_profile': 'Редактировать профиль',
    'save_changes': 'Сохранить изменения',
    'notifications': 'Уведомления',
    'security': 'Безопасность',
    'two_factor_auth': 'Двухфакторная аутентификация',
    'enable': 'Включить',
    'disable': 'Отключить',
    'last_active': 'Последняя активность',
    'sign_out': 'Выйти',
    'user_account': 'Учетная запись',
    'user_settings': 'Настройки пользователя',
    'update_profile': 'Обновить профиль',
    'profile_overview': 'Обзор профиля',
    'account_settings': 'Настройки аккаунта',
    'username': 'Имя пользователя',
    'change_avatar': 'Изменить аватар',
    'update_info': 'Обновить информацию',
    'appearance': 'Внешний вид',
    'theme': 'Тема',
    'light': 'Светлая',
    'dark': 'Тёмная',
    'language_setting': 'Язык',
    'total_storage': 'Общий объем',
    'used_storage': 'Использовано',
    'free_storage': 'Свободно',
    'upgrade_plan': 'Улучшить план',
    'account_activity': 'Активность аккаунта',
    'recent_activity': 'Недавняя активность',
    'login_history': 'История входов',
    'cancel': 'Отмена',
    'gb': 'ГБ',
    'personal_data': 'Личные данные',
    'delete_account': 'Удалить аккаунт',
    'attach_github': 'Привязать GitHub',
    'user': 'Пользователь',
    'back': 'Назад',
    'file_types': 'Типы файлов',
    
    // Создание папки
    'bucket_creation': 'Создание папки',
    'create_bucket_description': 'Создайте новую папку для хранения ваших файлов',
    'bucket_name': 'Название папки',
    'bucket_name_required': 'Название папки обязательно',
    'bucket_name_min_length': 'Название папки должно содержать минимум 3 символа',
    'bucket_name_placeholder': 'Например: Мои документы',
    'access_mode': 'Режим доступа',
    'private': 'Приватный',
    'only_for_you': 'Только для вас',
    'public': 'Публичный',
    'accessible_by_link': 'Доступ по ссылке',
    'bucket_creation_error': 'Ошибка при создании папки',
    'bucket_created': 'Папка создана!',
    'bucket_created_description': 'Папка "{name}" успешно создана',
    'bucket_name_empty': 'Название папки не может быть пустым',
    'created': 'Создано!',
    'creating': 'Создание...',
    'files_in_folder': 'Управление файлами в папке',
    'rename_button': 'Переименовать',
    'move_button': 'Переместить',
    'delete_button': 'Удалить',
    'delete_file': 'Удалить файл',
    'delete_file_confirm': 'Удалить файл?',
    'delete_file_confirmation': 'Вы уверены, что хотите удалить файл',
    'action_cannot_be_undone': 'Это действие нельзя отменить.',
    'file_deleted': 'Файл удален',
    'file_deleted_successfully': 'Файл успешно удален',
    'error_deleting_file': 'Ошибка при удалении файла',
    'missing_data_for_delete': 'Отсутствуют данные для удаления файла',
    'download_file': 'Скачать файл',
    'download_button': 'Скачать',
    'file_downloaded_successfully': 'Файл успешно скачан',
    'error_downloading_file': 'Ошибка при скачивании файла',
    'missing_data_for_download': 'Отсутствуют данные для скачивания файла',

    // Sidebar
    'dashboard': 'Обзор',
    'folders': 'Папки',
    'starred': 'Избранное',
    'sharing': 'Общее',
    'shared_with': 'Общий доступ',
    'preferences': 'Предпочтения',
  }
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>('en');
  const [isMounted, setIsMounted] = useState(false);
  
  const toggleLanguage = () => {
    setLanguage(prevLanguage => prevLanguage === 'en' ? 'ru' : 'en');
  }
  
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  }
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage === 'en' || savedLanguage === 'ru') {
      setLanguage(savedLanguage);
    } else {
      const browserLang = navigator.language.split('-')[0];
      setLanguage(browserLang === 'ru' ? 'ru' : 'en');
    }
    
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('language', language);
      document.documentElement.lang = language;
    }
  }, [language, isMounted]);
  
  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isMounted,
        t
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}; 