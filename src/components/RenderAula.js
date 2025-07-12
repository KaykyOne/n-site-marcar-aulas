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
        <div className='flex gap-3 bg-gray-100 shadow-md rounded-xl justify-start items-stretch text-start border border-gray-200 flex-col fade-in overflow-hidden'>
            {/* Ícone */}
            <div className='flex flex-col gap-2 justify-center items-start'>
                <div className='flex w-full gap-3'>
                    <span className="material-icons !text-7xl bg-primary text-white rounded-r-xl rounded-t-none p-2">
                        {iconsButton[item.tipo] || ""}
                    </span>
                    {tipo !== 1 && (
                        <p className='text-2xl'><strong>Data:</strong> <br /> {item.data}</p>
                    )
                    }
                </div>


                <div className='flex flex-col flex-1 gap-1 p-2'>


                    <p><strong>Hora:</strong> {item.hora}</p>

                    {tipo === 1 ? (
                        <p className='capitalize'><strong>Aluno:</strong> {(`${item.nome} ${item.sobrenome}`) || 'Não especificado'}</p>
                    ) : (
                        <p className='capitalize'><strong>Instrutor:</strong> {item.nome_instrutor || 'Não especificado'}</p>
                    )}

                    {tipo === 1 && (
                        <>
                            <p><strong>Veículo:</strong> {`${item.placa} ${item.modelo}`}</p>
                        </>
                    )}
                </div>
            </div>

            {/* Infos principais */}


            <div className='w-full p-2'>
                {/* Botão de excluir, só se tipo !== 1 */}
                {tipo !== 1 && (
                    <Button type={3} onClick={() => handleAction && handleAction('Excluir', item)}>
                        Cancelar
                        <span className="material-icons">delete</span>
                    </Button>
                )}
            </div>

        </div>
    );
}
