import { FC, useState } from "react";
import { FlexBackground } from "../components/general_utility/Background";
import { DashboardSidebar } from "../components/general_utility/DashboardSidebar";
// import { useNavigate } from "react-router-dom";
import "../styles/Account.css";
import "../components/assets/cat-coding.jpg";

interface User {
  name: string;
  email: string;
  affiliation: string;
  gender: "Male" | "Female" | "Other";
  bio: string;
  profilePic: string;
};

interface CompetitionDetails {
  degree: string;
  year: number;
  isICPCEligible: boolean;
  competitionLevel: "A" | "B" | "AB";
  isBoersenEligible: boolean;
};

export const Account: FC = () => {
  // Mocked  data
  const [user, setUser] = useState<User>({
    name: "John Doe",
    email: "john.doe@example.com",
    affiliation: "UNSW",
    gender: "Male",
    bio: "I am super passionate about coding problem solving!",
    profilePic: "../components/assets/default-profile.jpg",
  });

  const [compDetails, setCompDetails] = useState<CompetitionDetails>({
    degree: "Computer Science",
    year: 3,
    isICPCEligible: true,
    competitionLevel: "A",
    isBoersenEligible: false,
  });

  // const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [newDetails, setNewDetails] = useState<User>(user);
  const [newCompDetails, setNewCompDetails] = useState<CompetitionDetails>(compDetails);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    setUser(newDetails);
    setCompDetails(newCompDetails);
    setEditing(false);
  };

  const handleCancel = () => {
    setNewDetails(user);
    setNewCompDetails(compDetails);
    setEditing(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const photoFile = e.target.files?.[0];

    if (photoFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDetails({...newDetails, profilePic: reader.result as string});
      };
      reader.readAsDataURL(photoFile);
    }
  };

  return (
  <FlexBackground>
    <DashboardSidebar name={user.name} affiliation={user.affiliation} />
    <div className="account-container">
      <div className="account-card">
        <div className="profile-pic" style={{ backgroundImage: `url(${newDetails.profilePic})` }} />

        <div className="details-card">
          <div className="account-item">
            <label>Profile Picture:</label>
            { editing ? (
              <input 
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            ) : (
              <div className="details-text">Profile picture uploaded</div>
            )}
          </div>
          <div className="account-item">
            <label>Name:</label>
            { editing ? (
              <input
                type="text"
                value={newDetails.name}
                onChange={(e) => setNewDetails({...newDetails, name: e.target.value })}
              />
            ) : (
              <div className="details-text">{user.name}</div>
            )}
          </div>
          <div className="account-item">
            <label>Email:</label>
            { editing ? (
              <input
                type="email"
                value={newDetails.email}
                onChange={(e) => setNewDetails({...newDetails, email: e.target.value })}
              />
            ) : (
              <div className="details-text">{user.email}</div>
            )}
          </div>
          <div className="account-item">
            <label>Affiliation:</label>
            { editing ? (
              <input
                type="text"
                value={newDetails.affiliation}
                onChange={(e) => setNewDetails({...newDetails, affiliation: e.target.value })}
              />
            ) : (
              <div className="details-text">{user.affiliation}</div>
            )}
          </div>
          <div className="account-item">
            <label>Gender:</label>
            { editing ? (
                <select
                  value={newDetails.gender}
                  onChange={(e) => {
                    setNewDetails({...newDetails, gender: e.target.value as "Male" | "Female" | "Other" });
                    setNewCompDetails({...newCompDetails, isBoersenEligible: e.target.value !== "Male"});
                  }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <div className="details-text">{user.gender}</div>
              )}
          </div>
          <div className="account-item">
            <label>Bio:</label>
            { editing ? (
              <input
                type="text"
                value={newDetails.bio}
                onChange={(e) => setNewDetails({...newDetails, bio: e.target.value })}
              />
            ) : (
              <div className="details-text">{user.bio}</div>
            )}
          </div>
        </div>

        <div className="details-card">
            <div className="account-item">
              <label>Degree:</label>
              { editing ? (
                <input
                  type="text"
                  value={newCompDetails.degree}
                  onChange={(e) => setNewCompDetails({...newCompDetails, degree: e.target.value })}
                />
              ) : (
                <div className="details-text">{compDetails.degree}</div>
              )}
            </div>
            <div className="account-item">
              <label>Year:</label>
              { editing ? (
                <input
                  type="number"
                  value={newCompDetails.year}
                  onChange={(e) => setNewCompDetails({...newCompDetails, year: Number(e.target.value) })}
                />
              ) : (
                <div className="details-text">{compDetails.year}</div>
              )}
            </div>
            <div className="account-item">
              <label>ICPC Eligible:</label>
              { editing ? (
                <select
                  value={newCompDetails.isICPCEligible ? "yes" : "no"}
                  onChange={(e) => setNewCompDetails({...newCompDetails, isICPCEligible: e.target.value === "yes" })}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              ) : (
                <div className="details-text">{compDetails.isICPCEligible ? "Yes" : "No"}</div>
              )}
            </div>
            <div className="account-item">
              <label>Boersen Eligible:</label>
              <div className="details-text">{compDetails.isBoersenEligible ? "Yes" : "No"}</div>
            </div>
            <div className="account-item">
              <label>Competition Level:</label>
              { editing ? (
                <select
                  value={newCompDetails.competitionLevel}
                  onChange={(e) => setNewCompDetails({...newCompDetails, competitionLevel: e.target.value as "A" | "B" | "AB" })}
                >
                  <option value="A">A - Competitive</option>
                  <option value="B">B - Participation</option>
                  <option value="AB">No preference</option>
                </select>
              ) : (
                <div className="details-text">
                  {compDetails.competitionLevel === "A"
                    ? "Competitive"
                    : compDetails.competitionLevel === "B"
                    ? "Participation"
                    : "No preference"}
                </div>
              )}
            </div>
        </div>

        <div className="action-buttons">
            { editing ? (
              <>
                <button className="save-button" onClick={handleSave}>Save</button>
                <button className="cancel-button" onClick={handleCancel}>Cancel</button>
              </>
            ) : (
              <button className="edit-button" onClick={handleEdit}>Edit</button>
            )}
        </div>
      </div>
    </div>
  </FlexBackground>
  );
}