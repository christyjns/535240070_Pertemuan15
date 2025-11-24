import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

async function addTodo(formData: FormData) {
  'use server';
  const title = formData.get('title') as string;
  if (title) {
    await prisma.todo.create({ data: { title } });
    revalidatePath('/todo'); 
  }
}

async function deleteTodo(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  if (id) {
    await prisma.todo.delete({ where: { id: parseInt(id) } });
    revalidatePath('/todo');
  }
}

export default async function TodoPage() {
  const todos = await prisma.todo.findMany();

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h1>Todo List (SQLite + Prisma)</h1>
      
      <form action={addTodo} style={{ marginBottom: '20px' }}>
        <input 
          name="title" 
          type="text" 
          placeholder="Apa tugasmu?" 
          style={{ padding: '8px', width: '70%' }} 
          required 
        />
        <button type="submit" style={{ padding: '8px', marginLeft: '5px' }}>Tambah</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', padding: '10px 0' }}>
            <span>{todo.title}</span>
            <form action={deleteTodo}>
              <input type="hidden" name="id" value={todo.id} />
              <button type="submit" style={{ background: 'red', color: 'white', border: 'none', padding: '5px' }}>Hapus</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}