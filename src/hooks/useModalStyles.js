const useModalStyles = (customStyles = {}) => {
  const styles = {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: '5px',
    boxShadow: 24,
    p: 4,
  }

  return { ...styles, ...customStyles }
}

export default useModalStyles
