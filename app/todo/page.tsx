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
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: 'desc' } 
  });

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        width: '100%',
        maxWidth: '480px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        padding: '30px',
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: '#333', 
          fontSize: '24px', 
          marginBottom: '25px',
          fontWeight: '700'
        }}>
          ✨ My Task List
        </h1>
        
        <form action={addTodo} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <input 
            name="title" 
            type="text" 
            placeholder="Mau ngerjain apa hari ini?" 
            required 
            style={{ 
              flex: 1,
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '16px',
              outline: 'none',
              transition: 'border 0.2s'
            }} 
          />
          <button type="submit" style={{ 
            padding: '12px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}>
            Tambah
          </button>
        </form>

        {todos.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
            Belum ada tugas. Yuk produktif! 🚀
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {todos.map((todo) => (
              <li key={todo.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '15px 0',
                borderBottom: '1px solid #eee'
              }}>
                <span style={{ fontSize: '16px', color: '#444' }}>{todo.title}</span>
                <form action={deleteTodo}>
                  <input type="hidden" name="id" value={todo.id} />
                  <button type="submit" style={{ 
                    backgroundColor: '#ffe5e5', 
                    color: '#d32f2f', 
                    border: 'none', 
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}>
                    Hapus
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}