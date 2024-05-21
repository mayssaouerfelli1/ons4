import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser,faEye, faHome, faSignInAlt, faLanguage, faBook, faQuestionCircle, faShoppingCart, faDownload, faArrowAltCircleUp  } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import logo1 from './logo1.jpg';
import { Modal, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom'; 
// Importez vos images ici
import sciencemat from './sciencemat.PNG';
import langue from './langue.PNG';
import computer from './computer.PNG';
import art from './art.PNG';
import nedia from './nedia.PNG';
import economic from './economic.PNG';
import langpsycho from './psycho.PNG';
import cuisine from './cuisine.PNG';
import maquillage from './maquillage.PNG';
import motivationalMusic from './Motivation.mp3'; // Import de la musique
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Sidebar = ({ option, setOption }) => {
  const { t } = useTranslation('app');

  return (
    <div className="sidebar2">
      <div className='brand'>
        <br /> <img src={logo1} alt="logo1" /> <br /><br /><br />
      </div>
      <div className={option === 'courses' ? 'active' : ''} onClick={() => setOption('courses')}>
        <FontAwesomeIcon icon={faBook} /> {t('Catalogue de cours')}
      </div><br />
      <div className={option === 'quiz' ? 'active' : ''} onClick={() => setOption('quiz')}>
        <FontAwesomeIcon icon={faQuestionCircle} /> {t('Quiz')}
      </div>
    </div>
  );
};

const Apprenant = () => {
  const [option, setOption] = useState('courses');
  const [activeNavItem, setActiveNavItem] = useState(null);
  const { t, i18n } = useTranslation('apprenant');
  const [languageDropdownVisible, setLanguageDropdownVisible] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const audioRef = useRef(null);
  const [currentPage, setCurrentPage] = useState('catalogue');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOriginalLanguage, setSelectedOriginalLanguage] = useState('');
  const [courses, setCourses] = useState([]); // État pour stocker les cours associés au domaine sélectionné
  const [comments, setComments] = useState({});
  const [courseComments, setCourseComments] = useState([]);
// Ajoutez un nouvel état pour contrôler l'affichage de la modal
const [showCommentsModal, setShowCommentsModal] = useState(false);
const [quizScore, setQuizScore] = useState(0);

const handleAnswerSelection = (selectedOption, correctAnswer) => {
  if (selectedOption === correctAnswer) {
    // Si la réponse est correcte, incrémentez le score de 1
    setQuizScore((prevScore) => prevScore + 1);
  }
};




  useEffect(() => {
    // Votre logique pour récupérer les cours depuis l'API
  
    // Mettez à jour l'état des commentaires avec un objet vide pour chaque cours
    const initialCommentsState = {};
    courses.forEach(course => {
      initialCommentsState[course._id] = '';
    });
    setComments(initialCommentsState);
  }, [courses]);

  const handleOriginalLanguageChange = (event) => {
    setSelectedOriginalLanguage(event.target.value);
  };

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setCurrentPage('categoryDetail');
  
    try {
      const response = await axios.get(`http://localhost:3001/api/getcours?domaine=${category.name}`);
      const filteredCourses = response.data.filter(course => course.domaine === category.name);
      setCourses(filteredCourses);
    } catch (error) {
      console.error("Erreur lors de la récupération des cours :", error);
      // Gérer les erreurs de manière appropriée
    }
  };
  
  
  const [showScoreModal, setShowScoreModal] = useState(false);
  

  // Fonction pour ouvrir la modal du score
  const handleShowScoreModal = () => {
    setShowScoreModal(true);
  };

  const handleCloseScoreModal = () => {
    setShowScoreModal(false);
  };

  const [quizFinalScore, setQuizFinalScore] = useState(0);

// Mettez à jour la fonction handleFinishQuiz pour calculer le score final et afficher la modal du score
const handleFinishQuiz = () => {
  if (!selectedQuiz) {
    return;
  }
  const finalScore = (quizScore / selectedQuiz.questions.length) * 100;
  console.log('Score final:', finalScore);
  // Mettez à jour l'état du score final
  setQuizFinalScore(finalScore);
  // Réinitialisez le score du quiz
  setQuizScore(0);
  // Activez la modal du score
  setShowScoreModal(true);
};
  
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/quizzes');
        setQuizzes(response.data.quizzes);
      } catch (error) {
        console.error('Erreur lors de la récupération des quiz :', error);
      }
    };

    if (option === 'quiz') {
      fetchQuizzes();
    }
  }, [option]);

  useEffect(() => {
    if (selectedQuiz) {
      audioRef.current.play();
    }
  }, [selectedQuiz]);

  

  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/logout');

      if (response.data.success) {
        navigate('/');
      } else {
        console.error('Erreur lors de la déconnexion :', response.data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  const toggleLanguageDropdown = () => {
    setLanguageDropdownVisible(!languageDropdownVisible);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleNavItemClick = (item) => {
    setActiveNavItem(item);
    setLanguageDropdownVisible(false);
  };

  const categories = [
    { id: 1, name: t('sciences_math'), image: sciencemat },
    { id: 2, name: t('langues'), image: langue },
    { id: 3, name: t('informatique_technologie'), image: computer },
    { id: 4, name: t('arts_culture'), image: art },
    { id: 5, name: t('developpement_personnel'), image: nedia },
    { id: 6, name: t('affaires_economie'), image: economic },
    { id: 7, name: t('sciences_sociales'), image: langpsycho },
    { id: 8, name: t('cuisine'), image: cuisine },
    { id: 9, name: t('maquillage'), image: maquillage }
  ];

  const [selectedLanguage, setSelectedLanguage] = useState('');


  const handleViewFile = (fileName) => {
    // Effectuer une requête GET vers l'API pour récupérer le contenu du fichier
    fetch(`http://localhost:3001/api/file-content?fileName=${fileName}`)
      .then(response => {
        // Vérifier si la réponse est réussie
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération du fichier');
        }
        // Récupérer le contenu du fichier à partir de la réponse
        return response.text();
      })
      .then(fileContent => {
        // Ouvrir une nouvelle fenêtre ou un nouvel onglet avec le contenu du fichier
        window.open().document.write(fileContent);
      })
      .catch(error => {
        // Gérer les erreurs
        console.error('Erreur lors de la récupération du fichier :', error);
        // Afficher un message d'erreur à l'utilisateur
        toast.error('Erreur lors de la récupération du fichier');
      });
  };
  
  
  

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    // Faites quelque chose avec la langue sélectionnée...
  };

  

  const [comment, setComment] = useState('');
  
  const { id_cours } = useParams(); 
  const handleCommentSubmit = async (courseId, apprenantId) => {
    try {
      // Récupérer le commentaire du cours spécifié
      const commentValue = comments[courseId];
  
      // Effectuer une requête API pour ajouter le commentaire au cours
      await axios.post(`http://localhost:3001/api/${courseId}/commentaires`, { 
        commentaire: commentValue,
        apprenantId: apprenantId // Inclure l'ID de l'apprenant actuellement connecté
      });
  
      // Mettre à jour localement les commentaires avec le nouveau commentaire ajouté
      setCourseComments(prevComments => ({
        ...prevComments,
        [courseId]: [
          ...(prevComments[courseId] || []), // Ajouter les commentaires précédents s'ils existent
          { commentaire: commentValue } // Ajouter le nouveau commentaire
        ]
      }));
  
      // Réinitialiser le champ de commentaire après la soumission réussie
      setComments(prevState => ({
        ...prevState,
        [courseId]: ''
      }));
  
      // Afficher un message de succès
      toast.success('Commentaire soumis avec succès!');
    } catch (error) {
      // Gérer les erreurs
      console.error('Erreur lors de la soumission du commentaire :', error);
      // Afficher un message d'erreur
      toast.error('Erreur lors de la soumission du commentaire');
    }
};

  
  useEffect(() => {
    const fetchCommentsForCourses = async () => {
      const commentsMap = {};
      for (const course of courses) {
        try {
          const response = await axios.get(`http://localhost:3001/api/${course._id}/GETcommentaires`);
          commentsMap[course._id] = response.data.commentaires;
        } catch (error) {
          console.error(`Erreur lors de la récupération des commentaires pour le cours ${course._id}:`, error);
          commentsMap[course._id] = [];
        }
      }
      
      setCourseComments(commentsMap);
    };

    fetchCommentsForCourses();
  }, [courses]);


  const handleCommentChange = (event, courseId) => {
    const { value } = event.target;
    setComments(prevState => ({
      ...prevState,
      [courseId]: value
    }));
  };

  
  const handleShowComments = async (courseId) => {
    try {
        const response = await axios.get(`http://localhost:3001/api/${courseId}/GETcommentaires`);
        const comments = response.data.commentaires;
        setCourseComments(comments);
        setShowCommentsModal(true);
    } catch (error) {
        console.error('Erreur lors de la récupération des commentaires :', error);
    }
};


  return (
    <div className="accueil-container">
      <Sidebar option={option} setOption={setOption} />
      <div className="main-content">
        <div className="navbar">
          <div className="left-links">
            <h4 className="titre">Intellego</h4> &nbsp; &nbsp; &nbsp;
            <div
              className={`nav-item ${activeNavItem === 'home' ? 'active' : ''}`}
              onClick={() => handleNavItemClick('home')}
            >
              <FontAwesomeIcon icon={faHome} /> {t('accueil')}
            </div>
          </div>
          <div className="right-links">
            <div
              className={`nav-item ${activeNavItem === 'deconnexion' ? 'active' : ''}`}
              onClick={handleLogout}>
              
                <FontAwesomeIcon icon={faSignInAlt} /> {t('Déconnexion')}
              </div>

              <div
              className={`nav-item ${activeNavItem === 'user' ? 'active' : ''}`}
              >
              
              <FontAwesomeIcon icon={faUser} /> {t('Nom utilisateur')}
              </div>





              <div
                className={`nav-item ${activeNavItem === 'language' ? 'active' : ''}`}
                onClick={() => {
                  handleNavItemClick('language');
                  toggleLanguageDropdown();
                }}
              >
                <FontAwesomeIcon icon={faLanguage} /> {t('langue')}
                {languageDropdownVisible && (
                  <div className="language-dropdown">
                    <ul>
                      <li onClick={() => changeLanguage('en')}>{t('anglais')}</li>
                      <li onClick={() => changeLanguage('fr')}>{t('francais')}</li>
                      <li onClick={() => changeLanguage('ar')}>{t('arabe')}</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          <br /><br />
          
          <div>
          {option === 'courses' && (
  <div>
    {currentPage === 'catalogue' && (
      <div>
        <h1 className="taille"><center>{t('catalogue')}</center></h1> <br /><br />
        <div className="grid-container">
          {categories.map((category) => (
            <div className="grid-item" key={category.id} onClick={() => handleCategoryClick(category)}>
              <br />
              <h3><b>{category.name}</b></h3>
              <img src={category.image} alt={category.name} />
            </div>
          ))}
        </div>
      </div>
    )}

    {currentPage === 'categoryDetail' && (
      <div>
        <h1 className="taille"><center>{selectedCategory.name}</center></h1>
        <br /><br />
        <div className="grid-container">
          {courses.map((course) => (
            <div className="grid-item" key={course._id}>
              <h2><p>{course.titre}</p></h2>
              <p><b>Instreucteur:</b></p>
              <p><b>Prix:</b> {course.prix}</p>
              <p><b>Langue:</b> {course.langue}</p>
              
              <button className="btn-acheter" style={{fontSize:30, backgroundColor: 'white', color:'black' }} >
                <FontAwesomeIcon icon={faShoppingCart} />
              </button>  &nbsp;&nbsp;
              
              <button className="btn-telecharger" style={{fontSize:30, backgroundColor: 'white', color:'black' }}>
                <FontAwesomeIcon icon={faDownload} />
              </button>    
              
              <h3>Commentaires:</h3><br/>
              <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
 
  {/* Vérifiez si la liste des commentaires est définie et n'est pas vide */}
  {courseComments[course._id] && Object.keys(courseComments[course._id]).length !== 0 ? (
    // Utilisez Object.values pour obtenir un tableau de commentaires
    Object.values(courseComments[course._id]).map((comment, index) => (
      <div key={index}>
        {/* Afficher chaque commentaire */}
        <p>{comment.commentaire}</p>
      </div>
    ))
  ) : (
    <p>Pas de commentaires disponibles</p>
  )}
</div>




              <br />
              <br /><br />
              {/* Champ de commentaire indépendant pour chaque cours */}
              <div style={{ position: 'relative', width: '100%' }}>
                <textarea
                  rows="4"
                  placeholder="Entrez votre commentaire ici..."
                  value={comments[course._id]} // Utilisez l'état des commentaires pour ce cours
                  onChange={(e) => handleCommentChange(e, course._id)} // Passez l'ID du cours
                  style={{ width: '100%' }} // Assurez-vous que la zone de texte occupe toute la largeur
                />
                {/* Bouton pour soumettre le commentaire */}
                <button 
                  onClick={() => handleCommentSubmit(course._id)}
                  style={{ position: 'absolute', fontSize:20 ,bottom: 43, right: 10, padding: '8px 13px', backgroundColor: 'white', color:'black' }} // Positionnez le bouton en bas à 
                >
                  <FontAwesomeIcon icon={faArrowAltCircleUp} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)}



          </div>
  
          {option === 'quiz' && (
            <div>
              <h1 className="taille"><center>{t('quiz')}</center></h1>
              <br /><br /><br /><br />
              <div className="grid-container">
                {quizzes?.map((quiz, index) => (
                  <div className="grid-item" key={quiz._id}>
                    <div onClick={() => setSelectedQuiz(quiz)} style={{ cursor: 'pointer' }}>
                      <p className='tit'>{quiz.titre}</p>
                    </div>
                  </div>
                ))}
              </div>
              {selectedQuiz && (
             <Modal show={true} onHide={() => setSelectedQuiz(null)}>
             <Modal.Header closeButton>
               <Modal.Title>{selectedQuiz.titre}</Modal.Title>
             </Modal.Header>
             <Modal.Body style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
               <form>
                 {selectedQuiz.questions.map((question, index) => (
                   <div key={index}>
                     <h4><p><b><span style={{ color: '#2E8B57' }}>Question {index + 1}:</span></b></p></h4>
                     <p>{question.text}</p>
                     {question.suggestions.map((suggestion, optionIndex) => (
                       <div key={optionIndex} style={{ display: 'inline-block', marginRight: '1rem' }}>
                         <input
                           type="radio"
                           id={`suggestion-${index}-${optionIndex}`}
                           name={`question-${index}`}
                           value={suggestion}
                           onChange={() => handleAnswerSelection(suggestion, question.correctAnswer)}
                         />
                         <label htmlFor={`suggestion-${index}-${optionIndex}`} style={{ marginLeft: '0.5rem' }}>{suggestion}</label>
                       </div>
                     ))}
                     <br /><br />
                   </div>
                 ))}
               </form>
             </Modal.Body>
             <Modal.Footer>
               <Button variant="success" onClick={() => { handleFinishQuiz(); setSelectedQuiz(null); handleShowScoreModal(); }}>
                 Terminer le Quiz
               </Button>
             </Modal.Footer>
           </Modal>
           
           
           
              
              )}
<Modal show={showScoreModal} onHide={handleCloseScoreModal}>
  <Modal.Header closeButton>
    <Modal.Title>Résultat du Quiz</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {/* Utilisez l'état du score final pour afficher le score dans la modal */}
    <h2>
    <center>
      {t('Votre score')}: {quizFinalScore.toFixed(0)}/100
      {/* Condition pour afficher un message "Bravo" si le score est de 100 */}
      <br/><br/>
      {(quizFinalScore === 100 && (
  <span>
    {' '}
    Bravo!{' '}
    <span role="img" aria-label="smiley">
      😊
    </span>
  </span>
)) || (quizFinalScore >= 80 && quizFinalScore < 100 && (
  <span>
    {' '}
    Excellent travail!{' '}
    <span role="img" aria-label="smiley">
      👍
    </span>
  </span>
)) || (quizFinalScore >= 60 && quizFinalScore < 80 && (
  <span>
    {' '}
    Pas mal!{' '}
    <span role="img" aria-label="smiley">
      😃
    </span>
  </span>
)) || (quizFinalScore > 0 && quizFinalScore < 60 && (
  <span>
    {' '}
    Vous pouvez faire mieux!{' '}
    <span role="img" aria-label="smiley">
      😕
    </span>
  </span>
)) || (quizFinalScore === 0 && (
  <span>
    {' '}
    Essayez encore!{' '}
    <span role="img" aria-label="smiley">
      😔
    </span>
  </span>
))}


</center>
    </h2>
  </Modal.Body>
</Modal>

</div>
          )}
        </div>
        
        {/* Balise audio pour la musique motivante */}
        <audio ref={audioRef} src={motivationalMusic} loop />
      </div>
      
    );
    
  };
  
  export default Apprenant;
  
           
