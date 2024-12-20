import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import TextareaInput from '@/Components/Textarea';
import Select from '@/Components/Select';
import PrimaryButton from '@/Components/PrimaryButton';
import GreenButton from '@/Components/GreenButton';


export default function Dashboard({ auth, books }) {

    const [confirmingBookInsert, setConfirmingBookInsert] = useState(false);
    const [confirmingBookUpdate, setConfirmingBookUpdate] = useState(false);

    // 入力フォームの参照を定義
    const titleInput = useRef();
    const contentInput = useRef();
    const categoryInput = useRef();

    const {
        data,           // データを保存する場所
        setData,        // データを変更する関数
        delete: destroy, // 削除用の関数
        post,           // 新規登録用の関数
        put,            // 更新用の関数
        processing,     // 処理中かどうかの状態
        reset,          // データをリセットする関数
        errors,         // エラー情報
    } = useForm({
        title: '',      // タイトルの初期値は空
        content: '',    // 内容の初期値は空
        category: '',   // カテゴリーの初期値は空
    });

    // 登録ボタンを押したときの処理
    const confirmBookInsert = () => {
        // フォームを空にする
        setData({title:'', content:'', category:''});
        // 登録用の画面を表示
        setConfirmingBookInsert(true);
    };

    // 実際の登録処理
    const insertBook = (e) => {
        e.preventDefault();  // ページの再読み込みを防ぐ
        // データをサーバーに送信
        post(route('books.store'), {
            preserveScroll: true,  // スクロール位置を維持
            onSuccess: () => closeModal(),  // 成功したら画面を閉じる
            onError: () => titleInput.current.focus(),  // エラーならタイトル欄にフォーカス
            onFinish: () => reset(),  // 終わったらフォームをリセット
        });
    };

        // 編集ボタンを押したときの処理
    const confirmBookUpdate = (id, title, content, category) => {
        // フォームに既存の情報をセット
        setData({id, title, content, category});
        // 編集用の画面を表示
        setConfirmingBookUpdate(true);
    };

    // 実際の更新処理
    const updateBook = (e) => {
        e.preventDefault();
        // 更新したデータをサーバーに送信
        put(route('books.update', data.id), {
            // 以下、登録と同様の処理
        preserveScroll: true,
        onSuccess: () => closeModal_u(),
        onError: () => passwordInput.current.focus(),
        onFinish: () => reset(),
        });
    };

    const deletebook = (id) => {
        // 指定した本をデータベースから削除
        destroy(route('books.destroy', id), {
            preserveScroll: true,
        });
    };

        // 登録画面を閉じる
    const closeModal = () => {
        setConfirmingBookInsert(false);
        reset();
    };

    // 編集画面を閉じる
    const closeModal_u = () => {
        setConfirmingBookUpdate(false);
        reset();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Books</h2>}
        >
            <Head title="Books" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <GreenButton onClick={confirmBookInsert}>
                                    登録する
                                </GreenButton>

                                <Modal show={confirmingBookInsert} onClose={closeModal}>
                                    <form onSubmit={insertBook} className="p-6">
                                        <h2 className="text-lg font-medium text-gray-900">
                                            Are you sure you want to insert new item?
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-600">
                                            
                                        </p>

                                        <div className="mt-6">
                                            <InputLabel htmlFor="text" value="title" className="sr-only" />

                                            <TextInput
                                                id="title"
                                                type="text"
                                                name="title"
                                                ref={titleInput}
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                className="mt-1 block w-3/4"
                                                isFocused
                                                placeholder="title"
                                            />

                                            <InputError
                                                message={errors.password}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="mt-6">
                                            <InputLabel htmlFor="text" value="content" className="sr-only" />
                                            <TextareaInput
                                                id="content"
                                                type="text"
                                                name="content"
                                                ref={contentInput}
                                                value={data.content}
                                                onChange={(e) => setData('content', e.target.value)}
                                                className="mt-1 block w-3/4"
                                                placeholder="content"
                                            >
                                            </TextareaInput>
                                            <InputError message={errors.content} className="mt-2" />
                                        </div>

                                        <div className="mt-6">
                                            <Select id="category" name="category" ref={categoryInput} value={data.category} required='required' 
                                            onChange={(e) => setData('category', e.target.value)} className="mt-1 block w-3/4" 
                                            options={['','React','Vue','Laravel']}></Select>
                                            <InputError message={errors.category} className='mt-2'></InputError>
                                        </div>


                                        <div className="mt-6 flex justify-end">
                                            <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
                
                                            <PrimaryButton className="ml-3" disabled={processing}>
                                                登録
                                            </PrimaryButton>
                                        </div>

                                    </form>
                                </Modal>

                                <Modal show={confirmingBookUpdate} onClose={closeModal}>
                                    <form onSubmit={updateBook} className="p-6">
                                        <h2 className="text-lg font-medium text-gray-900">
                                            Are you sure you want to update this item?
                                        </h2>
                
                                        <p className="mt-1 text-sm text-gray-600">
                                        </p>
                                        
                                        <div className="mt-6">
                                            <InputLabel htmlFor="text" value="title" className="sr-only" />
                                            <TextInput
                                                id="title"
                                                type="text"
                                                name="title"
                                                ref={titleInput}
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                className="mt-1 block w-3/4"
                                                isFocused
                                                placeholder="title"
                                            />
                                            <InputError message={errors.title} className="mt-2" />
                                        </div>
                
                                        <div className="mt-6">
                                            <InputLabel htmlFor="text" value="content" className="sr-only" />
                                            <TextareaInput
                                                id="content"
                                                type="text"
                                                name="content"
                                                ref={contentInput}
                                                value={data.content}
                                                onChange={(e) => setData('content', e.target.value)}
                                                className="mt-1 block w-3/4"
                                                placeholder="content"
                                            >
                                            </TextareaInput>
                                            <InputError message={errors.content} className="mt-2" />
                                        </div>
                
                                        <div className="mt-6">
                                            <Select id="category" name="category" ref={categoryInput} value={data.category} required='required' 
                                            onChange={(e) => setData('category', e.target.value)} className="mt-1 block w-3/4" 
                                            options={['','React','Vue','Laravel']}></Select>
                                            <InputError message={errors.category} className='mt-2'></InputError>
                                        </div>
                
                                        <div className="mt-6 flex justify-end">
                                            <SecondaryButton onClick={closeModal_u}>Cancel</SecondaryButton>
                
                                            <PrimaryButton className="ml-3" disabled={processing}>
                                                更新
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                </Modal>



                    

                    <div>
                        <table className="w-full bg-gray-100 mt-2">
                            <thead className="bg-blue-100">
                                <tr className='text-green-600'>
                                    <th className='px-2 py-2 border border-gray-400'>#</th>
                                    <th className='px-2 py-2 border border-gray-400'>タイトル</th>
                                    <th className='px-2 py-2 border border-gray-400'>内容</th>
                                    <th className='px-2 py-2 border border-gray-400'>カテゴリー</th>
                                    <th className='px-2 py-2 border border-gray-400'></th>
                                    <th className='px-2 py-2 border border-gray-400'></th>
                                </tr>
                            </thead>
                            <tbody className='bg-white'>
                                {books.map((book) => (
                                    <tr key={book.id}>
                                        <td className='border border-gray-400 px-2 py-2 text-center'>{book.id}</td>
                                        <td className='border border-gray-400 px-2 py-2'>{book.title}</td>
                                        <td className='border border-gray-400 px-2 py-2'>{book.content}</td>
                                        <td className='border border-gray-400 px-2 py-2'>{book.category}</td>
                                        <td className='border border-gray-400 px-2 py-2'>
                                        <GreenButton onClick={() =>confirmBookUpdate(book.id,book.title,book.content,book.category)}>
                                            編集
                                        </GreenButton>
                                        </td>
                                        <td className='border border-gray-400 px-2 py-2'>
                                        <DangerButton
                                        onClick={() => deletebook(book.id)}>
                                            削除
                                        </DangerButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}