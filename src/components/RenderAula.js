import Button from './Button';

export default function RenderAula({ item, tipo, handleAction = null }) {
    const iconsButton = {
        A: "two_wheeler",
        B: "directions_car",
        C: "local_shipping",
        D: "directions_bus",
        E: "local_shipping"
    };
    return (
        <div className='flex gap-3 bg-gray-100 shadow-md rounded-xl p-3 justify-start items-stretch text-start m-2 border border-gray-200'>
            {/* Ícone */}
            <div className='flex flex-col border-r-2 border-gray-400 p-1 m-2 justify-center'>
                <span className="material-icons text-7xl">
                    {iconsButton[item.tipo] || ""}
                </span>
            </div>

            {/* Infos principais */}
            <div className='flex flex-col flex-1'>
                {tipo !== 1 && (
                    <h1 className='font-bold'>{item.data}</h1>
                )
                }

                <p><strong>Hora:</strong> <br/> {item.hora}</p>

                {tipo === 1 ? (
                    <p className='capitalize'><strong>Aluno:</strong> <br/> {(`${item.nome} ${item.sobrenome}`) || 'Não especificado'}</p>
                ) : (
                    <p className='capitalize'><strong>Instrutor:</strong> <br/> {item.nome_instrutor || 'Não especificado'}</p>
                )}

                {tipo === 1 && (
                    <>
                        <p><strong>Veículo:</strong> {`${item.placa} ${item.modelo}`}</p>
                    </>
                )}
            </div>

            {/* Botão de excluir, só se tipo !== 1 */}
            {tipo !== 1 && (
                <Button type={3} onClick={() => handleAction && handleAction('Excluir', item)}>
                    <span className="material-icons">delete</span>
                </Button>
            )}
        </div>
    );
}
