import React, { useState, useEffect } from 'react';
import './StaffManager.css';
import Logo from './Logo';
import Header from './Header';
import { DEFAULT_STAFF_DATA, staffDataUtils } from '../utils/staffData';

const StaffManager = ({ onBack, onLogout }) => {
  const [staff, setStaff] = useState([]);
  const [newStaff, setNewStaff] = useState({
    id: '',
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'standard',
    approver: '',
    hourlyRate: '',
    isActive: true,
    createdAt: new Date().toISOString()
  });
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingMember, setEditingMember] = useState(null);
  const [editingRateValue, setEditingRateValue] = useState('');
  const [editingApproverValue, setEditingApproverValue] = useState('');
  const [editingRoleValue, setEditingRoleValue] = useState('standard');

  // Use centralized default staff data
  const defaultStaff = DEFAULT_STAFF_DATA;

  // Load staff data from localStorage on component mount
  useEffect(() => {
    const savedStaff = staffDataUtils.getStaffData();
    console.log('=== STAFF MANAGER LOAD ===');
    console.log('Raw saved staff data:', savedStaff);
    
    if (savedStaff && savedStaff.length > 0) {
      setStaff(savedStaff);
      console.log('✅ Loaded existing staff data:', savedStaff.length, 'users');
      console.log('Users loaded:', savedStaff.map(u => ({ name: u.name, hourlyRate: u.hourlyRate, approver: u.approver })));
    } else {
      // If no staff data exists, create default data
      console.log('❌ No staff data found, creating default data');
      staffDataUtils.saveStaffData(defaultStaff);
      setStaff(defaultStaff);
    }
  }, []);





  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email || !newStaff.username || !newStaff.password || !newStaff.hourlyRate) {
      alert('Please fill in all required fields');
      return;
    }

    // Check if username already exists
    const usernameExists = staff.some(member => member.username === newStaff.username);
    if (usernameExists) {
      alert('Username already exists. Please choose a different username.');
      return;
    }

    const staffMember = {
      ...newStaff,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    console.log('Adding new staff member:', staffMember);

    // Add to staff array
    const updatedStaff = [...staff, staffMember];
    setStaff(updatedStaff);
    
    // Immediately save to localStorage
    staffDataUtils.saveStaffData(updatedStaff);
    
    // Verify the save worked
    const savedData = staffDataUtils.getStaffData();
    const parsedData = savedData;
    const newUserExists = parsedData.some(member => member.username === newStaff.username);
    
    console.log('Verification - User saved successfully:', newUserExists);
    console.log('Total users in database:', parsedData.length);
    console.log('All usernames:', parsedData.map(u => u.username));
    
    // Show success message
    setSuccessMessage(`✅ ${newStaff.name} has been added successfully! They can now log in with username: ${newStaff.username}`);
    
    // Notify other components about the data change
    window.dispatchEvent(new CustomEvent('staffDataUpdated', { 
      detail: { 
        updatedStaff,
        newMemberId: staffMember.id,
        action: 'add'
      }
    }));
    
    // Clear form
    setNewStaff({
      id: '',
      name: '',
      email: '',
      username: '',
      password: '',
      role: 'standard',
      approver: '',
      hourlyRate: '',
      isActive: true,
      createdAt: new Date().toISOString()
    });
    setIsAddingStaff(false);
    
    // Clear success message after 5 seconds
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const getAvailableApprovers = () => {
    return staff.filter(member => 
      (member.role === 'approver' || member.role === 'admin') && 
      member.isActive && 
      member.username !== newStaff.username
    );
  };

  const handleEditRate = (memberId, currentRate) => {
    setEditingMember(memberId);
    setEditingRateValue(currentRate || '');
  };

  const handleSaveRate = (memberId) => {
    const newRate = parseFloat(editingRateValue);
    if (isNaN(newRate) || newRate < 0) {
      alert('Please enter a valid hourly rate (must be a positive number)');
      return;
    }

    const updatedStaff = staff.map(member => 
      member.id === memberId 
        ? { ...member, hourlyRate: newRate.toFixed(2) }
        : member
    );

    setStaff(updatedStaff);
    
    // Save to localStorage immediately
    staffDataUtils.saveStaffData(updatedStaff);
    
    // Notify other components about the data change
    window.dispatchEvent(new CustomEvent('staffDataUpdated', { 
      detail: { 
        updatedStaff,
        updatedMemberId: memberId,
        action: 'update'
      }
    }));
    
    setEditingMember(null);
    setEditingRateValue('');
    setSuccessMessage(`✅ Hourly rate updated successfully!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCancelApproverEdit = () => {
    setEditingMember(null);
    setEditingApproverValue('');
  };

  const handleEditMember = (member) => {
    setEditingMember(member.id);
    setEditingRateValue(member.hourlyRate || '');
    setEditingApproverValue(member.approver || '');
    setEditingRoleValue(member.role || 'standard');
  };

  const handleSaveMember = (memberId) => {
    const newRate = parseFloat(editingRateValue);
    if (isNaN(newRate) || newRate < 0) {
      alert('Please enter a valid hourly rate (must be a positive number)');
      return;
    }

    console.log('Saving member:', memberId, 'Rate:', newRate, 'Approver:', editingApproverValue);

    const updatedStaff = staff.map(member => 
      member.id === memberId 
        ? { 
            ...member, 
            hourlyRate: newRate.toFixed(2),
            approver: editingApproverValue,
            role: editingRoleValue
          }
        : member
    );

    console.log('Updated staff data:', updatedStaff);
    
    // Update state - this will trigger the useEffect to save to localStorage
    setStaff(updatedStaff);
    
    // Save directly to localStorage immediately
    const saveResult = staffDataUtils.saveStaffData(updatedStaff);
    console.log('=== SAVE VERIFICATION ===');
    console.log('Save result:', saveResult);
    console.log('Updated staff data:', updatedStaff);
    
    // Verify the save worked immediately
    const savedData = staffDataUtils.getStaffData();
    console.log('Immediately after save - saved data:', savedData);
    console.log('Data matches:', JSON.stringify(savedData) === JSON.stringify(updatedStaff));
    
    // Notify other components about the data change
    window.dispatchEvent(new CustomEvent('staffDataUpdated', { 
      detail: { 
        updatedStaff,
        updatedMemberId: memberId,
        action: 'update'
      }
    }));
    
    // Verify the save worked immediately
    const verificationData = staffDataUtils.getStaffData();
    const updatedMember = verificationData.find(member => member.id === memberId);
    console.log('Verification - Member updated in localStorage:', updatedMember);

    setEditingMember(null);
    setEditingRateValue('');
    setEditingApproverValue('');
    setEditingRoleValue('standard');
    setSuccessMessage(`✅ Staff member updated successfully! Changes saved immediately.`);
    setTimeout(() => setSuccessMessage(''), 3000);
    
    console.log('Staff member updated and saved to localStorage:', memberId);
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
    setEditingRateValue('');
    setEditingApproverValue('');
    setEditingRoleValue('standard');
  };

  const getAvailableApproversForEdit = (currentMemberId) => {
    return staff.filter(member => 
      (member.role === 'approver' || member.role === 'admin') && 
      member.isActive && 
      member.id !== currentMemberId
    );
  };

  const handleDeleteStaff = (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      const updatedStaff = staff.filter(member => member.id !== id);
      setStaff(updatedStaff);
      
      // Immediately save to localStorage
      staffDataUtils.saveStaffData(updatedStaff);
      
      // Notify other components about the data change
      window.dispatchEvent(new CustomEvent('staffDataUpdated', { 
        detail: { 
          updatedStaff,
          deletedMemberId: id,
          action: 'delete'
        }
      }));
      
      console.log('Staff member deleted and saved to localStorage:', id);
    }
  };

  const handleToggleActive = (id) => {
    const updatedStaff = staff.map(member => 
      member.id === id ? { ...member, isActive: !member.isActive } : member
    );
    setStaff(updatedStaff);
    
    // Immediately save to localStorage
    staffDataUtils.saveStaffData(updatedStaff);
    
    // Notify other components about the data change
    window.dispatchEvent(new CustomEvent('staffDataUpdated', { 
      detail: { 
        updatedStaff,
        updatedMemberId: id,
        action: 'toggle'
      }
    }));
    
    console.log('Staff member status toggled and saved to localStorage:', id);
  };

  const handleResetData = () => {
    staffDataUtils.saveStaffData(defaultStaff);
    setStaff(defaultStaff);
    setSuccessMessage('Staff data has been reset to default. Try: johnsmith / Rookies123!');
  };



  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleDisplayName = (role) => {
    switch(role) {
      case 'standard': return 'Standard User';
      case 'approver': return 'Approver';
      case 'admin': return 'Admin';
      default: return role;
    }
  };

  return (
    <div className="staff-manager-container">
      <Header
        title="Staff Management"
        subtitle="Manage your team members and their roles"
        currentUser={null}
        onLogout={onLogout}
        onBack={onBack}
        showBackButton={true}
        showUserInfo={false}
        showLogo={false}
      />

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <div className="staff-controls">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search staff by name, email, or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="role-filter"
          >
            <option value="all">All Roles</option>
            <option value="standard">Standard User</option>
            <option value="approver">Approver</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <button
          onClick={() => setIsAddingStaff(true)}
          className="add-staff-btn"
        >
          + Add New Staff
        </button>
        
        <button
          onClick={() => {
            const savedData = localStorage.getItem('rookiesTimeStaff');
            if (savedData) {
              const parsed = JSON.parse(savedData);
              console.log('All localStorage data:', parsed);
              alert(`Total users: ${parsed.length}\nActive users: ${parsed.filter(u => u.isActive).length}\nCheck console for full data`);
            } else {
              alert('No data found in localStorage');
            }
          }}
          className="check-all-btn"
          style={{
            background: '#20c997',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          📊 Check All Data
        </button>
      </div>

      {isAddingStaff && (
        <div className="add-staff-form">
          <h3>Add New Staff Member</h3>
          <form onSubmit={handleAddStaff}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newStaff.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={newStaff.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  name="username"
                  value={newStaff.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={newStaff.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={newStaff.role}
                  onChange={handleInputChange}
                >
                  <option value="standard">Standard User</option>
                  <option value="approver">Approver</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label>Approver</label>
                <select
                  name="approver"
                  value={newStaff.approver}
                  onChange={handleInputChange}
                >
                  <option value="">No Approver (Admin/Approver)</option>
                  {getAvailableApprovers().map(approver => (
                    <option key={approver.username} value={approver.username}>
                      {approver.name} ({approver.username})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Hourly Rate (£)</label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={newStaff.hourlyRate}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  placeholder="14.25"
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">Save Staff Member</button>
              <button
                type="button"
                onClick={() => setIsAddingStaff(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="staff-list">
        <div className="staff-stats">
          <span>Total Staff: {staff.length}</span>
          <span>Active: {staff.filter(s => s.isActive).length}</span>
          <span>Admins: {staff.filter(s => s.role === 'admin').length}</span>
          <span>Approvers: {staff.filter(s => s.role === 'approver').length}</span>
          <span>Standard Users: {staff.filter(s => s.role === 'standard').length}</span>
        </div>
        
        <div className="staff-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Username</th>
                <th>Role</th>
                <th>Approver</th>
                <th>Hourly Rate</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map(member => (
                <tr key={member.id} className={!member.isActive ? 'inactive' : ''}>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td>{member.username}</td>
                  <td>
                    {editingMember === member.id ? (
                      <div className="approver-editor">
                        <select
                          value={editingRoleValue}
                          onChange={(e) => setEditingRoleValue(e.target.value)}
                        >
                          <option value="standard">Standard User</option>
                          <option value="approver">Approver</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    ) : (
                      <span className={`role-badge ${member.role}`}>
                        {getRoleDisplayName(member.role)}
                      </span>
                    )}
                  </td>
                  <td>
                    {editingMember === member.id ? (
                      <div className="approver-editor">
                        <select
                          value={editingApproverValue}
                          onChange={(e) => setEditingApproverValue(e.target.value)}
                        >
                          <option value="">No Approver</option>
                          {getAvailableApproversForEdit(member.id).map(approver => (
                            <option key={approver.username} value={approver.username}>
                              {approver.name} ({approver.username})
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      member.approver ? (
                        <span className="approver-badge">
                          {staff.find(s => s.username === member.approver)?.name || member.approver}
                        </span>
                      ) : (
                        <span className="no-approver">-</span>
                      )
                    )}
                  </td>
                  <td>
                    {editingMember === member.id ? (
                      <div className="rate-editor">
                        <input
                          type="number"
                          value={editingRateValue}
                          onChange={(e) => setEditingRateValue(e.target.value)}
                          step="0.01"
                          min="0"
                          placeholder="14.25"
                        />
                      </div>
                    ) : (
                      `£${member.hourlyRate || '0.00'}`
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${member.isActive ? 'active' : 'inactive'}`}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(member.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      {editingMember === member.id ? (
                        <>
                          <button
                            onClick={() => handleSaveMember(member.id)}
                            className="save-btn"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="cancel-btn"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleToggleActive(member.id)}
                            className={`toggle-btn ${member.isActive ? 'deactivate' : 'activate'}`}
                          >
                            {member.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleEditMember(member)}
                            className="edit-btn"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteStaff(member.id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffManager;
