using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using NotificationGitHub.Data;
using NotificationGitHub.Models.DashBoardViewModels;

namespace NotificationGitHub.Controllers
{
    public class DashBoardController : Controller
    {
        private readonly ApplicationDbContext _context;

        public DashBoardController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: DashBoard
        public async Task<IActionResult> Index()
        {
            return View(await _context.DashBoardViewModel.ToListAsync());
        }

        // GET: DashBoard/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var dashBoardViewModel = await _context.DashBoardViewModel
                .SingleOrDefaultAsync(m => m.ID == id);
            if (dashBoardViewModel == null)
            {
                return NotFound();
            }

            return View(dashBoardViewModel);
        }

        // GET: DashBoard/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: DashBoard/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,OrganizationName,Release,RepoName,CommitName,Commit")] DashBoardViewModel dashBoardViewModel)
        {
            if (ModelState.IsValid)
            {
                _context.Add(dashBoardViewModel);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(dashBoardViewModel);
        }

        // GET: DashBoard/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var dashBoardViewModel = await _context.DashBoardViewModel.SingleOrDefaultAsync(m => m.ID == id);
            if (dashBoardViewModel == null)
            {
                return NotFound();
            }
            return View(dashBoardViewModel);
        }

        // POST: DashBoard/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ID,OrganizationName,Release,RepoName,CommitName,Commit")] DashBoardViewModel dashBoardViewModel)
        {
            if (id != dashBoardViewModel.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(dashBoardViewModel);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!DashBoardViewModelExists(dashBoardViewModel.ID))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(dashBoardViewModel);
        }

        // GET: DashBoard/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var dashBoardViewModel = await _context.DashBoardViewModel
                .SingleOrDefaultAsync(m => m.ID == id);
            if (dashBoardViewModel == null)
            {
                return NotFound();
            }

            return View(dashBoardViewModel);
        }

        // POST: DashBoard/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var dashBoardViewModel = await _context.DashBoardViewModel.SingleOrDefaultAsync(m => m.ID == id);
            _context.DashBoardViewModel.Remove(dashBoardViewModel);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool DashBoardViewModelExists(int id)
        {
            return _context.DashBoardViewModel.Any(e => e.ID == id);
        }
    }
}
